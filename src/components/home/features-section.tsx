import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MessageCircle, 
  BookOpen, 
  Users, 
  Shield, 
  Globe
} from "lucide-react"

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "مساعد ذكي للأدوية",
      description: "احصل على معلومات فورية وموثوقة عن الأدوية باللغة العربية"
    },
    {
      icon: BookOpen,
      title: "دليل الأدوية الشامل",
      description: "قاعدة بيانات شاملة للأدوية المتوفرة في السودان"
    },
    {
      icon: Users,
      title: "استشارة الصيادلة",
      description: "تواصل مع صيادلة معتمدين للحصول على نصائح مخصصة"
    },
    {
      icon: Shield,
      title: "معلومات موثوقة",
      description: "محتوى طبي مراجع ومعتمد من خبراء الصيدلة"
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <Badge className="badge-professional">
            <Globe className="w-4 h-4" />
            مميزات المنصة
          </Badge>
          <h2 className="text-heading-1">
            كل ما تحتاجه للرعاية الصحية
          </h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto text-balance">
            منصة شاملة تجمع بين التكنولوجيا المتقدمة والخبرة الطبية لتقديم أفضل خدمة صحية
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="card-clean group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 gradient-medical rounded-full mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="leading-relaxed text-balance">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection