import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { validateMessage, validateConversationId } from '../middleware/validation.js';
import { geminiService } from '../services/gemini.js';
import { analyticsService } from '../services/analytics.js';

const router = express.Router();

// Send a message to the chatbot
router.post('/send', optionalAuthMiddleware, validateMessage, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { message, conversationId } = req.body;
  const userId = req.user?.id;
  const sessionId = req.headers['x-session-id'] || uuidv4();
  
  let currentConversationId = conversationId;
  
  try {
    // Create or get conversation
    if (!currentConversationId && userId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          metadata: { sessionId }
        })
        .select()
        .single();
      
      if (convError) {
        logger.error('Failed to create conversation:', convError);
        return res.status(500).json({ error: 'Failed to create conversation' });
      }
      
      currentConversationId = newConversation.id;
    }

    // Store user message
    let userMessageId = null;
    if (userId && currentConversationId) {
      const { data: userMessage, error: userMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversationId,
          type: 'user',
          content: message,
          status: 'delivered'
        })
        .select()
        .single();
      
      if (userMsgError) {
        logger.error('Failed to store user message:', userMsgError);
      } else {
        userMessageId = userMessage.id;
      }
    }

    // Log analytics
    if (userId) {
      await analyticsService.logEvent(supabase, {
        userId,
        conversationId: currentConversationId,
        sessionId,
        eventType: 'message_sent',
        eventData: { messageLength: message.length },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    const startTime = Date.now();
    
    // Get AI response from Gemini
    const aiResponse = await geminiService.generateResponse(message, {
      conversationId: currentConversationId,
      userId,
      supabase
    });
    
    const responseTime = Date.now() - startTime;

    // Store bot message
    let botMessageId = null;
    if (userId && currentConversationId) {
      const { data: botMessage, error: botMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversationId,
          type: 'bot',
          content: aiResponse.content,
          status: 'delivered',
          metadata: {
            confidence: aiResponse.confidence,
            category: aiResponse.category,
            responseTime
          }
        })
        .select()
        .single();
      
      if (botMsgError) {
        logger.error('Failed to store bot message:', botMsgError);
      } else {
        botMessageId = botMessage.id;
      }
    }

    // Log response analytics
    if (userId) {
      await analyticsService.logEvent(supabase, {
        userId,
        conversationId: currentConversationId,
        sessionId,
        eventType: 'response_received',
        eventData: {
          responseTime,
          confidence: aiResponse.confidence,
          category: aiResponse.category,
          contentLength: aiResponse.content.length
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    res.json({
      response: aiResponse.content,
      conversationId: currentConversationId,
      messageId: botMessageId,
      metadata: {
        confidence: aiResponse.confidence,
        category: aiResponse.category,
        responseTime
      }
    });

  } catch (error) {
    logger.error('Chat send error:', error);
    
    // Log error analytics
    if (userId) {
      await analyticsService.logEvent(supabase, {
        userId,
        conversationId: currentConversationId,
        sessionId,
        eventType: 'error',
        eventData: { error: error.message },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    res.status(500).json({
      error: 'Failed to process message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get conversation history
router.get('/conversations', authMiddleware, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const userId = req.user.id;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        status,
        created_at,
        updated_at,
        last_message_at,
        metadata
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to fetch conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }

    res.json({ conversations });
  } catch (error) {
    logger.error('Conversations fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', authMiddleware, validateConversationId, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { conversationId } = req.params;
  const userId = req.user.id;
  const { limit = 50, offset = 0 } = req.query;

  try {
    // Verify user owns the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        type,
        content,
        status,
        metadata,
        created_at,
        updated_at
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to fetch messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    res.json({ messages });
  } catch (error) {
    logger.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update conversation title
router.put('/conversations/:conversationId', authMiddleware, validateConversationId, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { conversationId } = req.params;
  const { title } = req.body;
  const userId = req.user.id;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const { data, error } = await supabase
      .from('conversations')
      .update({
        title: title.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update conversation:', error);
      return res.status(500).json({ error: 'Failed to update conversation' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation: data });
  } catch (error) {
    logger.error('Conversation update error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete conversation
router.delete('/conversations/:conversationId', authMiddleware, validateConversationId, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from('conversations')
      .update({
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to delete conversation:', error);
      return res.status(500).json({ error: 'Failed to delete conversation' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    logger.error('Conversation delete error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Submit feedback for a message
router.post('/messages/:messageId/feedback', authMiddleware, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { messageId } = req.params;
  const { rating, feedbackText, feedbackType } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    // Verify the message exists and belongs to user's conversation
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select(`
        id,
        conversation_id,
        conversations!inner(user_id)
      `)
      .eq('id', messageId)
      .single();

    if (msgError || !message || message.conversations.user_id !== userId) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const { data, error } = await supabase
      .from('message_feedback')
      .upsert({
        message_id: messageId,
        user_id: userId,
        rating,
        feedback_text: feedbackText,
        feedback_type: feedbackType
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to submit feedback:', error);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }

    res.json({ feedback: data });
  } catch (error) {
    logger.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export default router;