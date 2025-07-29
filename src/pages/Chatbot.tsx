import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Image as ImageIcon, 
  Bot, 
  User, 
  Loader2, 
  Brain,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import chatbotBg from "@/assets/chatbot-bg.jpg";
import { AnimatePresence, motion } from "framer-motion";
import { Send as SendIcon } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  image?: string;
}

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 مرحباً بك! اسألني عن أي دواء." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);
    if (!geminiApiKey) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ لم يتم العثور على مفتاح Gemini API. الرجاء إضافة VITE_GEMINI_API_KEY في ملف .env." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }
    try {
      const requestBody = {
        contents: [{
          parts: [{ text: input }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        systemInstruction: {
          parts: [{
            text: `أنت مساعد ذكي متخصص في الأدوية والصيدلة، مصمم خصيصاً للمرضى في السودان. مهمتك هي:
1. تقديم معلومات دقيقة ومفيدة عن الأدوية باللغة العربية السودانية
2. شرح الجرعات، طرق الاستخدام، والآثار الجانبية
3. تقديم نصائح حول تخزين الأدوية والتعامل مع الجرعات المفقودة
4. مساعدة في فهم الوصفات الطبية والتعليمات
5. تقديم معلومات عن البدائل المتاحة في السودان
يجب أن تكون إجاباتك:
- واضحة ومفهومة باللهجة السودانية البسيطة
- آمنة ومحذرة من المخاطر
- مصحوبة بتنبيه أن المعلومات لا تغني عن استشارة الطبيب أو الصيدلي
انتهي كل إجابة بـ: "⚠️ هذه معلومات أولية ولا تغني عن استشارة الطبيب أو الصيدلي المختص."`
          }]
        }
      };
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error('فشل في الحصول على الرد');
      }
      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من فهم طلبك. يرجى المحاولة مرة أخرى.';
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isArabic = messages.some((msg) => /[\u0600-\u06FF]/.test(msg.text));

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-b from-[#f9fafb] to-[#e3f2fd] dark:from-[#0A1128] dark:to-[#232946] font-arabic ${isArabic ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-card/80 p-4 shadow text-lg font-bold text-primary flex items-center gap-2 rounded-b-2xl backdrop-blur-md">
        🤖 روبوت الدواء
      </div>
      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md ${
                msg.sender === "bot"
                  ? "bg-white/70 dark:bg-card/70 text-left flex items-start gap-2"
                  : "ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white text-right"
              }`}
            >
              {msg.sender === "bot" && (
                <span className="inline-block w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center mr-2 shadow-glow">🤖</span>
              )}
              <span>{msg.text}</span>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[80%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md bg-white/70 dark:bg-card/70 text-left flex items-center gap-2"
            >
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center mr-2 shadow-glow">🤖</span>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Input Bar */}
      <div className="bg-white/90 dark:bg-card/90 border-t px-4 py-3 flex items-center gap-2 sticky bottom-0 backdrop-blur-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          className="flex-1 p-2 border rounded-full bg-gray-100 dark:bg-background focus:outline-none"
          placeholder="اكتب سؤالك هنا..."
        />
        <button
          className="p-2 rounded-full bg-primary text-white hover:scale-110 transition"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <span>يكتب...</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: ".2s" }} />
        <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: ".4s" }} />
      </span>
    </span>
  );
}

export default Chatbot;