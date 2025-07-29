import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  User, 
  Stethoscope,
  Shield,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (userType: 'patient' | 'pharmacist') => {
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك في دليلي الدوائي`,
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              دليلي الدوائي
            </h1>
          </div>
          <p className="text-muted-foreground">تسجيل الدخول إلى حسابك</p>
        </div>

        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              اختر نوع حسابك وسجل دخولك
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="patient" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  مريض
                </TabsTrigger>
                <TabsTrigger value="pharmacist" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  صيدلي
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">
                    <User className="w-4 h-4 ml-2" />
                    حساب المرضى
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    احصل على استشارات طبية ومعلومات عن الأدوية
                  </p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('patient'); }}>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="patient-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 pl-10 bg-background/50 border-primary/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="medical"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin ml-2" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 ml-2" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="pharmacist" className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">
                    <Shield className="w-4 h-4 ml-2" />
                    حساب الصيادلة
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    للصيادلة المعتمدين لتقديم الاستشارات الطبية
                  </p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('pharmacist'); }}>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacist-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="pharmacist-email"
                        type="email"
                        placeholder="pharmacist@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pharmacist-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="pharmacist-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 pl-10 bg-background/50 border-primary/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                    <p className="text-sm text-info flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      يتطلب تسجيل دخول الصيادلة التحقق من الهوية المهنية
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                    <Link to="/pharmacist-verification" className="text-primary hover:text-primary/80 transition-colors">
                      التحقق من الهوية
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="glow"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin ml-2" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 ml-2" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">أو</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  إنشاء حساب جديد
                  <ArrowRight className="inline w-4 h-4 mr-1" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;