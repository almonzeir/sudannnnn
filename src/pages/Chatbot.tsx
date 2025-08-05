import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  Send,
  Bot,
  User,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Shield,
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'delivered' | 'error';
  metadata?: {
    confidence?: number;
    category?: string;
    responseTime?: number;
  };
}

interface ChatStats {
  totalMessages: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '🤖 **السلام عليكم ورحمة الله وبركاته** 🌙\n\n⚠️ **تنبيه مهم: أنا مساعد ذكي وليس طبيب حقيقي!** ⚠️\n\n**أنا مساعد ذكي** أحاكي شخصية دكتور محمد الأمين - طبيب سوداني متخصص في الطب الباطني والأدوية. أنا هنا عشان أساعدك بمعلومات طبية عامة يا أخوي/أختي.\n\n🤖 **أنا ذكاء اصطناعي:**\n• أقدم معلومات طبية عامة فقط\n• لا أستطيع تشخيص الأمراض أو وصف العلاج\n• المعلومات التي أقدمها لا تغني عن الاستشارة الطبية\n\n💊 **شنو ممكن أساعدك فيهو:**\n• معلومات عن الأدوية وجرعاتها الصحيحة\n• الآثار الجانبية والتحذيرات المهمة\n• بدائل رخيصة ومتوفرة في السودان\n• نصائح طبية بسيطة ومفهومة\n• إرشادات للوقاية والعناية بالصحة\n\n🇸🇩 **معرفتي بالسودان:**\n• أعرف الصيدليات والمستشفيات في كل الولايات\n• أعرف أسعار الأدوية والبدائل المحلية\n• أراعي العادات والتقاليد السودانية\n\n🚨 **تنبيه مهم جداً:** أنا مساعد ذكي أقدم معلومات عامة فقط. **لازم تراجع دكتور مختص حقيقي** للفحص والتشخيص الدقيق!\n\n**يلا، اكتب سؤالك وأنا جاهز أساعدك بالمعلومات العامة إن شاء الله! 💬**',
      timestamp: new Date(),
      status: 'delivered',
      metadata: {
        confidence: 1.0,
        category: 'welcome',
        responseTime: 0
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [stats, setStats] = useState<ChatStats>({
    totalMessages: 1,
    avgResponseTime: 0,
    successRate: 100,
    lastActive: new Date()
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const messageContent = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      status: 'sending'
    };

    // Add user message and clear input
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Scroll to bottom smoothly
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    const startTime = Date.now();

    try {
      console.log('Sending request to backend API...');
      console.log('Input:', messageContent);

      // Use Gemini API directly
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت الدكتور محمد الأمين، مساعد طبي ذكي متخصص في الطب والصحة. تتحدث باللهجة السودانية وتقدم المشورة الطبية بطريقة ودودة ومفهومة.

الرسالة: ${messageContent}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error:', errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini API Response:', data);
      const responseTime = Date.now() - startTime;
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('Invalid response structure:', data);
        throw new Error('استجابة غير صحيحة من الخدمة');
      }

      const botResponse = data.candidates[0].content.parts[0].text;
      
      // Update user message status to delivered
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));

      const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            confidence: 0.85,
            category: 'medical',
            responseTime
          }
        };

      setMessages(prev => prev.concat(botMessage));
      
      // Update stats
      setStats(prev => ({
        totalMessages: prev.totalMessages + 2,
        avgResponseTime: (prev.avgResponseTime + responseTime) / 2,
        successRate: ((prev.successRate * (prev.totalMessages - 2)) + 100) / prev.totalMessages,
        lastActive: new Date()
      }));
      
      setIsConnected(true);
      
      // Auto-scroll to bottom and focus input for better UX
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
      
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        let errorContent = `⚠️ **خطأ في الاتصال** ⚠️\n\n❌ فشل في الاتصال بخدمة الذكاء الاصطناعي\n\n`;
        
        if (error.message === 'مفتاح API غير متوفر' || !apiKey || apiKey === 'your_gemini_api_key_here') {
          errorContent += `**🔑 مفتاح API غير صحيح**\n\n**المطلوب:**\n• احصل على مفتاح API من Google AI Studio\n• أضف المفتاح في ملف .env\n• أعد تشغيل التطبيق\n\n**رابط الحصول على المفتاح:**\nhttps://makersuite.google.com/app/apikey`;
        } else {
          errorContent += `**الأسباب المحتملة:**\n• مشكلة في الاتصال بالإنترنت\n• خطأ في مفتاح API\n• مشكلة مؤقتة في الخادم\n\n**الحلول:**\n• تحقق من اتصال الإنترنت\n• أعد المحاولة بعد قليل\n• تواصل مع الدعم الفني`;
        }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: errorContent,
        timestamp: new Date(),
        status: 'error'
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
      ).concat(errorMessage));
      
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 2,
        successRate: ((prev.successRate * (prev.totalMessages - 2)) + 0) / prev.totalMessages
      }));
      
      setIsConnected(false);
      
      toast({
          title: "خطأ في الاتصال",
          description: "فشل في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Enhanced Message Component with better styling
  const MessageComponent = React.forwardRef<HTMLDivElement, { message: Message; index: number }>(({ message, index }, ref) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.2, 
          delay: Math.min(index * 0.05, 0.3),
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              isUser 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                : isSystem
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            }`}
          >
            {isUser ? <User className="w-5 h-5" /> : isSystem ? <Shield className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
          </motion.div>
          
          {/* Message Content */}
          <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl shadow-lg border ${
              isUser 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500/30 rounded-br-md' 
                : isSystem
                ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/40 text-amber-100 border-amber-600/30 rounded-bl-md'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border-gray-600/50 rounded-bl-md'
            }`}>
              <div className={`text-sm leading-relaxed ${isUser ? 'text-right' : 'text-left'}`}>
                {message.content.split('\n').map((line, i) => (
                  <div key={i} className="mb-1 last:mb-0">
                    {line.includes('**') ? (
                      <div dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/•/g, '•')
                      }} />
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
              
              {/* Message Metadata */}
              {message.metadata && (
                <div className={`flex items-center gap-2 mt-2 pt-2 border-t border-gray-600/30 text-xs`}>
                  {message.metadata.confidence && (
                    <Badge variant="secondary" className="bg-gray-600/50 text-gray-300 border-gray-500/50">
                      دقة: {Math.round(message.metadata.confidence * 100)}%
                    </Badge>
                  )}
                  {message.metadata.category && (
                    <Badge variant="outline" className="border-gray-500/50 text-gray-300">
                      {message.metadata.category === 'medication' ? 'أدوية' :
                       message.metadata.category === 'symptoms' ? 'أعراض' :
                       message.metadata.category === 'prevention' ? 'وقاية' :
                       message.metadata.category === 'welcome' ? 'ترحيب' : 'طبي'}
                    </Badge>
                  )}
                  {message.metadata.responseTime && (
                    <Badge variant="outline" className="border-gray-500/50 text-gray-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {message.metadata.responseTime}ms
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Status and Timestamp */}
            <div className={`flex items-center gap-2 mt-1 text-xs ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {/* Status Icon */}
              <div className="flex items-center">
                {message.status === 'sending' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-3 h-3 text-gray-400" />
                  </motion.div>
                )}
                {message.status === 'delivered' && (
                  <CheckCircle className="w-3 h-3 text-emerald-300" />
                )}
                {message.status === 'error' && (
                  <XCircle className="w-3 h-3 text-red-400" />
                )}
              </div>
              
              {/* Timestamp */}
              <div className={`text-xs mt-1 ${isUser ? 'text-right text-emerald-300/70' : 'text-left text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });
  MessageComponent.displayName = 'MessageComponent';

  // Enhanced Typing Indicator
  const TypingIndicator = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex justify-start mb-6"
      >
        <div className="flex items-start gap-3 max-w-[85%]">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg"
          >
            <Stethoscope className="w-5 h-5" />
          </motion.div>
          
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-300 ml-2">دكتور محمد الأمين يكتب</span>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden flex flex-col">
      {/* Dark Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Medical Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[Heart, Activity, Stethoscope, Pill, Shield][i % 5] && 
              React.createElement([Heart, Activity, Stethoscope, Pill, Shield][i % 5], { 
                className: "w-8 h-8" 
              })
            }
          </motion.div>
        ))}
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl flex-shrink-0"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Stethoscope className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  دكتور محمد الأمين
                </h1>
                <p className="text-gray-400 text-sm">مساعدك الطبي الذكي المتخصص</p>
              </div>
            </div>
            
            {/* Connection Status & Stats */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600/50"
              >
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs font-medium ${
                  isConnected ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600/50"
              >
                <div className="text-center">
                  <div className="text-xs text-gray-400">الرسائل</div>
                  <div className="text-sm font-bold text-emerald-400">{stats.totalMessages}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">معدل الاستجابة</div>
                  <div className="text-sm font-bold text-blue-400">{Math.round(stats.avgResponseTime)}ms</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">معدل النجاح</div>
                  <div className="text-sm font-bold text-teal-400">{Math.round(stats.successRate)}%</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageComponent key={message.id} message={message} index={index} />
            ))}
            
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-xl p-4 shadow-lg flex-shrink-0"
        >
          <div className="container mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isTyping ? "جاري الإرسال..." : "اكتب سؤالك الطبي هنا... (مثال: ما هو دواء الصداع؟)"}
                  className={`w-full px-4 py-3 text-right border text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 pr-12 ${
                    isTyping 
                      ? 'bg-gray-800/70 border-gray-500/50 cursor-not-allowed' 
                      : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70 focus:bg-gray-700/80'
                  }`}
                  disabled={isTyping}
                />
                <motion.div
                  animate={{ scale: isTyping ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Pill className="w-5 h-5 text-emerald-400" />
                </motion.div>
              </div>
              
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isTyping ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {[
                "ما هو دواء الصداع؟",
                "أعراض نزلة البرد",
                "نصائح للوقاية من الأمراض",
                "أدوية الضغط المتوفرة"
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInputValue(suggestion)}
                  className="px-3 py-1 text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-full border border-gray-600/50 transition-all duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-2xl border border-emerald-500/30 text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Settings className="w-6 h-6" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

export default Chatbot;