import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, 
  BookOpen, 
  Heart, 
  Stethoscope, 
  MessageCircle, 
  ArrowRight,
  Star
} from "lucide-react"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-8">
            <Badge className="badge-professional animate-fade-in hover-lift glow-blue">
              <Heart className="w-4 h-4" />
              منصة طبية موثوقة
            </Badge>
            
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-display gradient-text animate-pulse-soft">
                دليلي الدوائي
              </h1>
              <p className="text-body-large text-muted-foreground max-w-2xl text-balance">
                منصتك الموثوقة للحصول على معلومات الأدوية والاستشارات الطبية في السودان
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end animate-scale-in">
              <Button size="xl" variant="medical" asChild className="group btn-professional hover-lift">
                <Link to="/chatbot">
                  <Brain className="w-6 h-6 ml-2" />
                  تحدث مع المساعد الذكي
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="hover-lift glass">
                <Link to="/medications">
                  <BookOpen className="w-6 h-6 ml-2" />
                  تصفح دليل الأدوية
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <Card className="card-clean hover-lift shadow-strong">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 gradient-medical rounded-full animate-glow">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">مساعد طبي ذكي</CardTitle>
                    <CardDescription>متوفر 24/7 لخدمتك</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 glass rounded-lg animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                  <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm">ما هي الجرعة المناسبة للأسبرين؟</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                  <Brain className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm">الجرعة المعتادة للبالغين هي 75-100 مجم يومياً...</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground animate-fade-in" style={{animationDelay: '0.6s'}}>
                  <span>تم الرد في ثوانِ</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning animate-pulse-soft" />
                    <span>4.9/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection