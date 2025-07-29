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
  const [selectedPharmacist, setSelectedPharmacist] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
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

  const handleSubmitQuestion = () => {
    if (!question.trim() || !selectedPharmacist) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة السؤال واختيار صيدلي",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال السؤال",
      description: "سيرد عليك الصيدلي في أقرب وقت ممكن",
    });

    setQuestion('');
    setSelectedPharmacist(null);
    setCategory('');
  };

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
            <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  اطرح سؤالك
                </CardTitle>
                <CardDescription>
                  اختر صيدلي واطرح سؤالك للحصول على استشارة مجانية
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Pharmacist Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">اختر الصيدلي:</label>
                  <div className="grid gap-4">
                    {pharmacists.filter(p => p.available).map((pharmacist) => (
                      <Card 
                        key={pharmacist.id}
                        className={`cursor-pointer transition-all duration-300 border-2 ${
                          selectedPharmacist === pharmacist.id 
                            ? 'border-primary shadow-medical' 
                            : 'border-primary/20 hover:border-primary/40'
                        }`}
                        onClick={() => setSelectedPharmacist(pharmacist.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {pharmacist.name}
                                  {pharmacist.verified && (
                                    <CheckCircle className="w-4 h-4 text-success" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">{pharmacist.specialization}</p>
                              </div>
                            </div>
                            
                            <div className="text-left space-y-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                <span className="text-sm font-medium">{pharmacist.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {pharmacist.responseTime}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Question Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">فئة السؤال:</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-background/50 border border-primary/20 rounded-lg focus:border-primary/60 focus:outline-none"
                    >
                      <option value="">اختر الفئة</option>
                      <option value="dosage">الجرعات</option>
                      <option value="interactions">التداخلات الدوائية</option>
                      <option value="side-effects">الآثار الجانبية</option>
                      <option value="chronic">الأمراض المزمنة</option>
                      <option value="pregnancy">الحمل والرضاعة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">سؤالك:</label>
                    <Textarea
                      placeholder="اكتب سؤالك بالتفصيل..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-32 bg-background/50 border-primary/20 focus:border-primary/60"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitQuestion}
                    className="w-full"
                    variant="glow"
                    size="lg"
                  >
                    <Send className="w-5 h-5 ml-2" />
                    إرسال السؤال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pharmacists List Tab */}
          <TabsContent value="pharmacists" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacists.map((pharmacist, index) => (
                <Card 
                  key={pharmacist.id}
                  className="bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center shadow-glow">
                        <User className="w-10 h-10 text-foreground" />
                      </div>
                      {pharmacist.verified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-background">
                          <CheckCircle className="w-5 h-5 text-foreground" />
                        </div>
                      )}
                      <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full ${
                        pharmacist.available ? 'bg-success' : 'bg-muted'
                      } animate-pulse`}></div>
                    </div>
                    
                    <CardTitle className="text-xl">{pharmacist.name}</CardTitle>
                    <CardDescription>{pharmacist.specialization}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{pharmacist.experience} سنة خبرة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span>{pharmacist.rating}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{pharmacist.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{pharmacist.responseTime}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">اللغات:</span>
                      <div className="flex gap-1 mt-1">
                        {pharmacist.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant={pharmacist.available ? "medical" : "outline"}
                        size="sm"
                        className="flex-1"
                        disabled={!pharmacist.available}
                        onClick={() => {
                          setSelectedPharmacist(pharmacist.id);
                          setActiveTab('ask');
                        }}
                      >
                        <MessageCircle className="w-4 h-4 ml-2" />
                        {pharmacist.available ? 'اسأل الآن' : 'غير متاح'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-8">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card 
                  key={question.id}
                  className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{question.patient}</CardTitle>
                          {question.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              عاجل
                            </Badge>
                          )}
                          <Badge 
                            variant={
                              question.status === 'answered' ? 'default' :
                              question.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {question.status === 'answered' ? 'تم الرد' :
                             question.status === 'in-progress' ? 'جاري الرد' : 'في الانتظار'}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">
                          {question.category}
                        </Badge>
                      </div>
                      
                      <div className="text-left text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {question.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {question.question}
                    </CardDescription>
                    
                    {question.status === 'pending' && (
                      <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="text-sm text-warning">
                          في انتظار الرد من أحد الصيادلة المتخصصين
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pharmacists;