import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  User, 
  Stethoscope,
  Shield,
  ArrowRight,
  Settings
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // OAuth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول بجوجل');
      setIsLoading(false);
    }
  };

  const handleLogin = async (userType: 'patient' | 'pharmacist' | 'admin') => {
    if (!email || !password) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('فشل في تسجيل الدخول');
      }

      // Fetch user profile to check role
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If profile doesn't exist, create one with default role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
            role: userType === 'admin' ? 'admin' : 'patient'
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      } else {
        // Check if user role matches login type
        if (userType === 'admin' && userProfile.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('ليس لديك صلاحيات المدير');
        }
        if (userType === 'pharmacist' && userProfile.role !== 'pharmacist') {
          await supabase.auth.signOut();
          throw new Error('حسابك غير مفعل كصيدلي. يرجى التقدم بطلب أولاً');
        }
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Navigate based on user role
      if (userType === 'admin') {
        navigate('/admin');
      } else if (userType === 'pharmacist') {
        navigate('/pharmacist-dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  مريض
                </TabsTrigger>
                <TabsTrigger value="pharmacist" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  صيدلي
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  مدير
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

              <TabsContent value="admin" className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">
                    <Settings className="w-4 h-4 ml-2" />
                    حساب المديرين
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    للمديرين المخولين لإدارة النظام والموافقة على الصيادلة
                  </p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('admin'); }}>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="admin-password"
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
                  
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      تسجيل دخول المديرين يتطلب صلاحيات خاصة
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="default"
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
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle className="w-5 h-5 ml-2" />
                تسجيل الدخول بجوجل
              </Button>
              
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