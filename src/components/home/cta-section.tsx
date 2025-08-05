import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, LogIn } from "lucide-react"

const CTASection = () => {
  return (
    <section className="py-20 section-divider bg-muted/20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-heading-1">
            ابدأ رحلتك الصحية الآن
          </h2>
          <p className="text-body-large text-muted-foreground text-balance">
            انضم إلى آلاف المستخدمين الذين يثقون في دليلي الدوائي
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="xl" variant="medical" asChild>
            <Link to="/register">
              <Users className="w-6 h-6 ml-2" />
              إنشاء حساب جديد
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link to="/login">
              <LogIn className="w-6 h-6 ml-2" />
              دخول المستخدمين الحاليين
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTASection