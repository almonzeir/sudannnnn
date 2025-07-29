import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  User, 
  Stethoscope,
  Shield,
  ArrowRight,
  Phone,
  MapPin,
  FileText,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    licenseNumber: '',
    university: '',
    graduationYear: '',
    specialization: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (userType: 'patient' | 'pharmacist') => {
    if (!formData.fullName || !formData.email || !formData.password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "خطأ",
        description: "يرجى الموافقة على الشروط والأحكام",
        variant: "destructive"
      });
      return;
    }

    if (userType === 'pharmacist' && (!formData.licenseNumber || !formData.university)) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع بيانات الترخيص المهني",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: userType === 'pharmacist' 
          ? "سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة"
          : "مرحباً بك في دليلي الدوائي",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
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
          <p className="text-muted-foreground">إنشاء حساب جديد</p>
        </div>

        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-2xl">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center">
              اختر نوع حسابك وأدخل بياناتك
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
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister('patient'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">الاسم الكامل *</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="patient-name"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="pr-10 bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="patient-phone"
                          placeholder="+249 123 456 789"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pr-10 bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">البريد الإلكتروني *</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pr-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patient-location">المدينة</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="patient-location"
                        placeholder="الخرطوم"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pr-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-password">كلمة المرور *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="patient-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="patient-confirm-password">تأكيد كلمة المرور *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="patient-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pr-10 pl-10 bg-background/50 border-primary/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id="terms-patient" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms-patient" className="text-sm">
                      أوافق على{' '}
                      <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                        الشروط والأحكام
                      </Link>
                      {' '}و{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                        سياسة الخصوصية
                      </Link>
                    </Label>
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
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 ml-2" />
                        إنشاء حساب
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
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister('pharmacist'); }}>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">المعلومات الشخصية</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pharmacist-name">الاسم الكامل *</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="pharmacist-name"
                            placeholder="د. أحمد محمد علي"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="pr-10 bg-background/50 border-primary/20"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pharmacist-phone">رقم الهاتف *</Label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="pharmacist-phone"
                            placeholder="+249 123 456 789"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="pr-10 bg-background/50 border-primary/20"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pharmacist-email">البريد الإلكتروني *</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="pharmacist-email"
                          type="email"
                          placeholder="pharmacist@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pr-10 bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pharmacist-location">مكان العمل *</Label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="pharmacist-location"
                          placeholder="الخرطوم - شارع الجامعة"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="pr-10 bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">المعلومات المهنية</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-number">رقم الترخيص *</Label>
                        <div className="relative">
                          <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="license-number"
                            placeholder="PHARM-2024-001"
                            value={formData.licenseNumber}
                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                            className="pr-10 bg-background/50 border-primary/20"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialization">التخصص</Label>
                        <Input
                          id="specialization"
                          placeholder="صيدلة إكلينيكية"
                          value={formData.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="university">الجامعة *</Label>
                        <Input
                          id="university"
                          placeholder="جامعة الخرطوم - كلية الصيدلة"
                          value={formData.university}
                          onChange={(e) => handleInputChange('university', e.target.value)}
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="graduation-year">سنة التخرج</Label>
                        <Input
                          id="graduation-year"
                          placeholder="2015"
                          value={formData.graduationYear}
                          onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>رفع شهادة التخرج والترخيص</Label>
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">اضغط لرفع الملفات أو اسحبها هنا</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (حد أقصى 5MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pharmacist-password">كلمة المرور *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="pharmacist-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="pharmacist-confirm-password">تأكيد كلمة المرور *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="pharmacist-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pr-10 pl-10 bg-background/50 border-primary/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-info">
                        <p className="font-medium mb-1">عملية التحقق من الهوية:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• سيتم مراجعة جميع المستندات المرفوعة</li>
                          <li>• التحقق من صحة الترخيص المهني</li>
                          <li>• التواصل معك خلال 24-48 ساعة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id="terms-pharmacist" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms-pharmacist" className="text-sm">
                      أوافق على{' '}
                      <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                        الشروط والأحكام
                      </Link>
                      {' '}و{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                        سياسة الخصوصية
                      </Link>
                      {' '}وأتعهد بتقديم استشارات طبية مسؤولة
                    </Label>
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
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 ml-2" />
                        إرسال طلب التسجيل
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
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  تسجيل الدخول
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

export default Register;