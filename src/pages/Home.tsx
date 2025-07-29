import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  BookOpen, 
  Users, 
  Shield, 
  Stethoscope, 
  Brain, 
  Globe, 
  Heart,
  ArrowRight,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "مساعد ذكي للأدوية",
      description: "احصل على معلومات فورية وموثوقة عن الأدوية باللغة العربية",
      color: "medical-blue"
    },
    {
      icon: BookOpen,
      title: "دليل الأدوية الشامل",
      description: "قاعدة بيانات شاملة للأدوية المتوفرة في السودان",
      color: "medical-green"
    },
    {
      icon: Users,
      title: "استشارة الصيادلة",
      description: "تواصل مع صيادلة معتمدين للحصول على نصائح مخصصة",
      color: "medical-purple"
    },
    {
      icon: Shield,
      title: "معلومات موثوقة",
      description: "محتوى طبي مراجع ومعتمد من خبراء الصيدلة",
      color: "success"
    }
  ];

  const stats = [
    { number: "10,000+", label: "دواء في القاعدة", icon: BookOpen },
    { number: "500+", label: "صيدلي معتمد", icon: Users },
    { number: "50,000+", label: "استشارة مكتملة", icon: CheckCircle },
    { number: "24/7", label: "متاح دائماً", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-8">
              <Badge variant="outline" className="inline-flex items-center gap-2 text-primary border-primary/30 hover:border-primary animate-fade-in-up">
                <Heart className="w-4 h-4" />
                منصة طبية موثوقة
              </Badge>
              <div className="relative w-full max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 rounded-3xl bg-white/60 dark:bg-card/60 shadow-xl backdrop-blur-lg -z-10" style={{ filter: 'blur(2px)' }} />
                <h1 className="text-5xl lg:text-7xl font-extrabold bg-gradient-medical bg-clip-text text-transparent leading-tight drop-shadow-lg">
                  دليلي الدوائي
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                منصتك الموثوقة للحصول على معلومات الأدوية والاستشارات الطبية في السودان
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button size="xl" variant="hero" asChild className="group shadow-glow hover:scale-105 transition-all duration-300">
                  <Link to="/chatbot">
                    <Brain className="w-6 h-6 ml-2 group-hover:animate-pulse" />
                    تحدث مع المساعد الذكي
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/medications">
                    <BookOpen className="w-6 h-6 ml-2" />
                    تصفح دليل الأدوية
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-medical rounded-full blur-3xl opacity-20 animate-glow-pulse"></div>
              <Card className="relative bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Stethoscope className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">مساعد طبي ذكي</CardTitle>
                      <CardDescription>متوفر 24/7 لخدمتك</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm">ما هي الجرعة المناسبة للأسبرين؟</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <Brain className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm">الجرعة المعتادة للبالغين هي 75-100 مجم يومياً...</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>تم الرد في ثوانِ</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span>4.9/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center space-y-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <Badge variant="outline" className="inline-flex items-center gap-2">
              <Globe className="w-4 h-4" />
              مميزات المنصة
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">
              كل ما تحتاجه للرعاية الصحية
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              منصة شاملة تجمع بين التكنولوجيا المتقدمة والخبرة الطبية لتقديم أفضل خدمة صحية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-medical rounded-full group-hover:shadow-glow transition-all duration-300 mx-auto">
                    <feature.icon className="w-8 h-8 text-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-card border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            ابدأ رحلتك الصحية الآن
          </h2>
          <p className="text-xl text-muted-foreground">
            انضم إلى آلاف المستخدمين الذين يثقون في دليلي الدوائي
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="xl" variant="glow" asChild>
              <Link to="/register">
                <Users className="w-6 h-6 ml-2" />
                إنشاء حساب جديد
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/login">
                دخول المستخدمين الحاليين
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;