import { Link } from "react-router-dom"
import { Stethoscope } from "lucide-react"

const Footer = () => {
  return (
    <footer className="glass-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-medical rounded-full flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold">دليلي الدوائي</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              منصة طبية موثوقة تهدف إلى تقديم معلومات دقيقة عن الأدوية والرعاية الصحية في السودان.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/chatbot" className="hover:text-primary transition-colors">المساعد الذكي</Link></li>
              <li><Link to="/medications" className="hover:text-primary transition-colors">دليل الأدوية</Link></li>
              <li><Link to="/pharmacists" className="hover:text-primary transition-colors">استشارة الصيادلة</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">مركز المساعدة</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>الخرطوم، السودان</p>
              <p>info@sudanimeds.com</p>
              <p>+249 123 456 789</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 دليلي الدوائي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer