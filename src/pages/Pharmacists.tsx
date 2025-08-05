import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  User, 
  Star, 
  Clock, 
  Send, 
  Shield,
  Award,
  MapPin,
  Phone,
  Mail,
  Plus,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PharmacistCard } from "@/components/pharmacist/PharmacistCard";
import { AskPharmacistForm } from "@/components/pharmacist/AskPharmacistForm";
import { QuestionCard } from "@/components/pharmacist/QuestionCard";

interface Pharmacist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  location: string;
  verified: boolean;
  available: boolean;
  responseTime: string;
  languages: string[];
  avatar?: string;
}

interface Question {
  id: string;
  patient: string;
  question: string;
  category: string;
  timestamp: Date;
  status: 'pending' | 'answered' | 'in-progress';
  urgent: boolean;
}

const Pharmacists = () => {
  const [activeTab, setActiveTab] = useState('ask');
  const { toast } = useToast();

  const pharmacists: Pharmacist[] = [
    {
      id: '1',
      name: 'د. أحمد محمد علي',
      specialization: 'صيدلة إكلينيكية',
      experience: 12,
      rating: 4.9,
      location: 'الخرطوم',
      verified: true,
      available: true,
      responseTime: '15 دقيقة',
      languages: ['العربية', 'الإنجليزية']
    },
    {
      id: '2',
      name: 'د. فاطمة إبراهيم',
      specialization: 'صيدلة المستشفيات',
      experience: 8,
      rating: 4.8,
      location: 'بحري',
      verified: true,
      available: true,
      responseTime: '20 دقيقة',
      languages: ['العربية', 'الإنجليزية']
    },
    {
      id: '3',
      name: 'د. خالد عثمان',
      specialization: 'الأدوية المزمنة',
      experience: 15,
      rating: 4.7,
      location: 'أم درمان',
      verified: true,
      available: false,
      responseTime: '30 دقيقة',
      languages: ['العربية']
    }
  ];

  const questions: Question[] = [
    {
      id: '1',
      patient: 'مريم أحمد',
      question: 'ما هي الجرعة المناسبة من الأنسولين لمريض سكري يبلغ من العمر 45 عاماً؟',
      category: 'أدوية السكري',
      timestamp: new Date(),
      status: 'pending',
      urgent: true
    },
    {
      id: '2',
      patient: 'عبد الله محمد',
      question: 'هل يمكن تناول الباراسيتامول مع الأسبرين في نفس الوقت؟',
      category: 'التداخلات الدوائية',
      timestamp: new Date(Date.now() - 3600000),
      status: 'in-progress',
      urgent: false
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <Badge variant="outline" className="inline-flex items-center gap-2">
            <Shield className="w-4 h-4" />
            صيادلة معتمدون
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            استشر صيدلي متخصص
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            احصل على استشارة مجانية من صيادلة معتمدين ومتخصصين
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="ask" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              اسأل صيدلي
            </TabsTrigger>
            <TabsTrigger value="pharmacists" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              الصيادلة
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              الأسئلة
            </TabsTrigger>
          </TabsList>

          {/* Ask Pharmacist Tab */}
          <TabsContent value="ask" className="space-y-8">
            <AskPharmacistForm pharmacists={pharmacists} />
          </TabsContent>

          {/* Pharmacists List Tab */}
          <TabsContent value="pharmacists" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacists.map((pharmacist, index) => (
                <PharmacistCard 
                  key={pharmacist.id}
                  pharmacist={pharmacist}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-fade-in-up"
                />
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-8">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionCard 
                  key={question.id}
                  question={question}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-fade-in-up"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pharmacists;