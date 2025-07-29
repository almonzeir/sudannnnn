import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu,
  X,
  Home,
  MessageCircle,
  BookOpen,
  Users,
  UserPlus,
  LogIn,
  Bell,
  Settings,
  Heart,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import React from "react";

if (typeof window !== "undefined") {
  const theme = localStorage.getItem("theme");
  if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const location = useLocation();

  // Apply theme to <html> element
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Listen to system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setIsDark(mq.matches);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [isDark]);

  const navigationItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "المساعد الذكي", href: "/chatbot", icon: MessageCircle },
    { name: "دليل الأدوية", href: "/medications", icon: BookOpen },
    { name: "الصيادلة", href: "/pharmacists", icon: Users },
  ];

  const authItems = [
    { name: "تسجيل الدخول", href: "/login", icon: LogIn, variant: "ghost" as const },
    { name: "إنشاء حساب", href: "/register", icon: UserPlus, variant: "medical" as const },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-medical rounded-full flex items-center justify-center shadow-glow group-hover:shadow-medical transition-all duration-300">
                  <Stethoscope className="w-5 h-5 text-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4">
                  <Heart className="w-4 h-4 text-medical-red animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                  دليلي الدوائي
                </h1>
                <p className="text-xs text-muted-foreground">منصة طبية موثوقة</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "medical" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "transition-all duration-300",
                    isActive(item.href) && "shadow-medical"
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-medical-red">
                  3
                </Badge>
              </Button>
              {/* Theme Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">🌞</span>
                <Switch checked={isDark} onCheckedChange={setIsDark} />
                <span className="text-xs text-muted-foreground">🌙</span>
              </div>
              
              {authItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.variant}
                  size="sm"
                  asChild
                  className="transition-all duration-300"
                >
                  <Link to={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}

              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in-up">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={isActive(item.href) ? "medical" : "ghost"}
                    size="sm"
                    asChild
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
                {/* Theme Switcher for Mobile */}
                <div className="flex items-center gap-2 py-2 px-2">
                  <span className="text-xs text-muted-foreground">🌞</span>
                  <Switch checked={isDark} onCheckedChange={setIsDark} />
                  <span className="text-xs text-muted-foreground">🌙</span>
                </div>
                
                <div className="border-t border-border/50 pt-2 mt-2">
                  {authItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={item.variant}
                      size="sm"
                      asChild
                      className="w-full justify-start mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-medical rounded-full flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-foreground" />
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
    </div>
  );
};

export default Layout;