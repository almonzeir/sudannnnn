import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/context/AuthContext"
import { UserNav } from "@/components/UserNav"
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
  Stethoscope,
  Sun,
  Moon
} from "lucide-react"

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const location = useLocation()

  const navigationItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "المساعد الذكي", href: "/chatbot", icon: MessageCircle },
    { name: "دليل الأدوية", href: "/medications", icon: BookOpen },
    { name: "الصيادلة", href: "/pharmacists", icon: Users },
  ]

  const authItems = [
    { name: "تسجيل الدخول", href: "/login", icon: LogIn, variant: "ghost" as const },
    { name: "إنشاء حساب", href: "/register", icon: UserPlus, variant: "medical" as const },
  ]

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group hover-lift">
            <div className="relative">
              <div className="w-10 h-10 gradient-medical rounded-full flex items-center justify-center animate-glow">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 animate-pulse-soft">
                <Heart className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">
                دليلي الدوائي
              </h1>
              <p className="text-xs text-muted-foreground">منصة طبية موثوقة</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                asChild
                className={`hover-lift transition-all duration-300 ${isActive(item.href) ? 'glow-blue' : 'hover:glass'}`}
              >
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover-lift glass">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive animate-pulse-soft">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover-lift glass hover:glow-cyan">
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            
            {/* Conditional Authentication Display */}
            {user ? (
              <UserNav />
            ) : (
              <>
                {authItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={item.variant}
                    size="sm"
                    asChild
                    className={`hover-lift transition-all duration-300 ${item.variant === 'medical' ? 'btn-professional glow-blue' : 'glass hover:glow-purple'}`}
                  >
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </>
            )}

            <Button variant="outline" size="icon" className="hover-lift glass hover:glow-purple">
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
          <div className="lg:hidden py-4 border-t border-border/50">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
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
              
              <div className="flex items-center justify-between py-2 px-2">
                <span className="text-sm text-muted-foreground">الوضع المظلم</span>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              <div className="border-t border-border/50 pt-2 mt-2 space-y-2">
                {/* Mobile Authentication Display */}
                {user ? (
                  <div className="px-2">
                    <UserNav />
                  </div>
                ) : (
                  <>
                    {authItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={item.variant}
                        size="sm"
                        asChild
                        className="w-full justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation