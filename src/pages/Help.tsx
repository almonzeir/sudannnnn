import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Settings,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";

const Help = () => {
  const faqItems = [
    {
      question: "كيف يمكنني استخدام المساعد الذكي؟",
      answer: "يمكنك التحدث مع المساعد الذكي عبر كتابة أسئلتك حول الأدوية أو رفع صورة للوصفة الطبية. سيقوم المساعد بتقديم معلومات أولية ونصائح مفيدة."
    },
    {
      question: "هل المعلومات المقدمة بديل عن الطبيب؟",
      answer: "لا، المعلومات المقدمة في المنصة هي للإرشاد فقط ولا تغني عن استشارة الطبيب أو الصيدلي المختص. ننصح دائماً بمراجعة أخصائي الرعاية الصحية."
    },
    {
      question: "كيف يمكنني التواصل مع صيدلي معتمد؟",
      answer: "يمكنك زيارة قسم الصيادلة للتواصل مع صيادلة معتمدين وطرح أسئلتك المتخصصة حول الأدوية والحصول على استشارات مخصصة."
    },
    {
      question: "هل الخدمة مجانية؟",
      answer: "نعم، جميع الخدمات الأساسية متاحة مجاناً بما في ذلك المساعد الذكي ودليل الأدوية والاستشارات الأولية."
    },
    {
      question: "كيف أضمن دقة المعلومات؟",
      answer: "جميع المعلومات في المنصة مراجعة من قبل خبراء الصيدلة ومحدثة بانتظام. كما نوصي بالتأكد من أي معلومة مع صيدلي أو طبيب مختص."
    }
  ];

  const quickLinks = [
    { title: "المساعد الذكي", description: "احصل على إجابات فورية", href: "/chatbot", icon: MessageCircle },
    { title: "دليل الأدوية", description: "تصفح قاعدة بيانات الأدوية", href: "/medications", icon: BookOpen },
    { title: "الصيادلة", description: "تواصل مع خبراء", href: "/pharmacists", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in-up">
          <Badge variant="outline" className="inline-flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            مركز المساعدة
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            كيف يمكننا مساعدتك؟
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ابحث عن إجابات لأسئلتك أو تواصل معنا للحصول على الدعم المطلوب
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {quickLinks.map((link, index) => (
            <Card key={index} className="group bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{link.description}</CardDescription>
                <Button variant="outline" size="sm" asChild className="w-full group-hover:border-primary/60">
                  <Link to={link.href} className="flex items-center justify-center gap-2">
                    انتقال
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">الأسئلة الشائعة</CardTitle>
            <CardDescription className="text-center">
              إجابات للأسئلة الأكثر شيوعاً حول استخدام المنصة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">لم تجد ما تبحث عنه؟</CardTitle>
            <CardDescription>
              تواصل معنا مباشرة وسنكون سعداء لمساعدتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">البريد الإلكتروني</h4>
                  <p className="text-muted-foreground">info@sudanimeds.com</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">الهاتف</h4>
                  <p className="text-muted-foreground">+249 123 456 789</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;