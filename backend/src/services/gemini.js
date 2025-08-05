import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    this.systemInstruction = `You are Dr. Sudani, a helpful medical assistant for Sudani Dar Meds pharmacy in Sudan. You speak in Sudanese Arabic dialect and provide medical guidance.

Key guidelines:
- Always remind users you're not a replacement for real medical consultation
- Provide helpful information about medications, symptoms, and general health
- Use Sudanese Arabic expressions and dialect naturally
- Be empathetic and understanding
- For serious symptoms, always recommend seeing a doctor
- You can help with medication information, dosages, side effects, and general health advice
- Keep responses conversational and friendly
- If unsure about something, admit it and suggest consulting a healthcare professional

Remember: You're here to help and inform, not to replace professional medical care.`;
  }

  async generateResponse(message, context = {}) {
    try {
      const { conversationId, userId, supabase } = context;
      
      // Get conversation history for context
      let conversationHistory = [];
      if (conversationId && supabase) {
        const { data: messages } = await supabase
          .from('messages')
          .select('type, content, created_at')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(10); // Last 10 messages for context
        
        if (messages) {
          conversationHistory = messages;
        }
      }

      // Build context-aware prompt
      let prompt = this.systemInstruction + '\n\n';
      
      if (conversationHistory.length > 0) {
        prompt += 'Previous conversation context:\n';
        conversationHistory.forEach(msg => {
          const role = msg.type === 'user' ? 'User' : 'Dr. Sudani';
          prompt += `${role}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `Current user message: ${message}\n\nPlease respond as Dr. Sudani:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Analyze response for categorization and confidence
      const analysis = this.analyzeResponse(text, message);
      
      return {
        content: text,
        confidence: analysis.confidence,
        category: analysis.category,
        metadata: {
          tokensUsed: this.estimateTokens(prompt + text),
          responseLength: text.length,
          hasConversationContext: conversationHistory.length > 0
        }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return fallback response
      return {
        content: 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى أو التواصل مع الصيدلية مباشرة.',
        confidence: 0.1,
        category: 'error',
        metadata: {
          error: error.message,
          fallback: true
        }
      };
    }
  }

  analyzeResponse(responseText, userMessage) {
    const text = responseText.toLowerCase();
    const userText = userMessage.toLowerCase();
    
    // Determine category based on content
    let category = 'general';
    
    if (this.containsMedicalTerms(text) || this.containsMedicalTerms(userText)) {
      category = 'medical';
    } else if (this.containsMedicationTerms(text) || this.containsMedicationTerms(userText)) {
      category = 'medication';
    } else if (this.containsEmergencyTerms(text) || this.containsEmergencyTerms(userText)) {
      category = 'emergency';
    } else if (this.containsPharmacyTerms(text) || this.containsPharmacyTerms(userText)) {
      category = 'pharmacy';
    }
    
    // Calculate confidence based on response characteristics
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for detailed responses
    if (responseText.length > 100) confidence += 0.1;
    if (responseText.length > 300) confidence += 0.1;
    
    // Decrease confidence for very short responses
    if (responseText.length < 50) confidence -= 0.2;
    
    // Increase confidence for medical/medication responses
    if (category === 'medical' || category === 'medication') confidence += 0.1;
    
    // Decrease confidence for emergency responses (should be handled carefully)
    if (category === 'emergency') confidence -= 0.2;
    
    // Ensure confidence is within bounds
    confidence = Math.max(0.1, Math.min(1.0, confidence));
    
    return { confidence, category };
  }

  containsMedicalTerms(text) {
    const medicalTerms = [
      'symptom', 'أعراض', 'مرض', 'disease', 'pain', 'ألم', 'fever', 'حمى',
      'headache', 'صداع', 'cough', 'سعال', 'cold', 'برد', 'flu', 'أنفلونزا',
      'infection', 'عدوى', 'treatment', 'علاج', 'diagnosis', 'تشخيص'
    ];
    return medicalTerms.some(term => text.includes(term));
  }

  containsMedicationTerms(text) {
    const medicationTerms = [
      'medication', 'دواء', 'medicine', 'pill', 'حبوب', 'tablet', 'أقراص',
      'dosage', 'جرعة', 'prescription', 'وصفة', 'pharmacy', 'صيدلية',
      'side effect', 'أعراض جانبية', 'antibiotic', 'مضاد حيوي'
    ];
    return medicationTerms.some(term => text.includes(term));
  }

  containsEmergencyTerms(text) {
    const emergencyTerms = [
      'emergency', 'طوارئ', 'urgent', 'عاجل', 'serious', 'خطير',
      'severe', 'شديد', 'hospital', 'مستشفى', 'doctor', 'دكتور',
      'chest pain', 'ألم في الصدر', 'difficulty breathing', 'صعوبة في التنفس'
    ];
    return emergencyTerms.some(term => text.includes(term));
  }

  containsPharmacyTerms(text) {
    const pharmacyTerms = [
      'pharmacy', 'صيدلية', 'pharmacist', 'صيدلي', 'store', 'متجر',
      'location', 'موقع', 'hours', 'ساعات', 'contact', 'تواصل',
      'price', 'سعر', 'cost', 'تكلفة', 'available', 'متوفر'
    ];
    return pharmacyTerms.some(term => text.includes(term));
  }

  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters for English, 2-3 for Arabic
    const englishChars = text.replace(/[\u0600-\u06FF]/g, '').length;
    const arabicChars = text.length - englishChars;
    
    return Math.ceil(englishChars / 4 + arabicChars / 2.5);
  }

  async getConversationSummary(conversationId, supabase) {
    try {
      const { data: messages } = await supabase
        .from('messages')
        .select('type, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (!messages || messages.length === 0) {
        return null;
      }

      const conversationText = messages
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n');
      
      const summaryPrompt = `Please provide a brief summary of this medical conversation in Arabic:\n\n${conversationText}\n\nSummary:`;
      
      const result = await this.model.generateContent(summaryPrompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      return null;
    }
  }

  async validateApiKey() {
    try {
      const result = await this.model.generateContent('Test message');
      await result.response;
      return true;
    } catch (error) {
      console.error('Gemini API key validation failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
export default GeminiService;