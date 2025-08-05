import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  Zap,
  Heart,
  Star,
  Gift,
  MessageSquare
} from 'lucide-react';

const NotificationTest = () => {
  const { toast } = useToast();

  // Custom Toast Examples
  const showSuccessToast = () => {
    toast({
      title: "نجح العمل! ✅",
      description: "تم حفظ البيانات بنجاح في قاعدة البيانات",
      variant: "default"
    });
  };

  const showErrorToast = () => {
    toast({
      title: "خطأ في النظام ❌",
      description: "فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى",
      variant: "destructive"
    });
  };

  const showInfoToast = () => {
    toast({
      title: "معلومة مهمة ℹ️",
      description: "سيتم تحديث النظام خلال 10 دقائق",
    });
  };

  // Sonner Toast Examples
  const showSonnerSuccess = () => {
    sonnerToast.success('تم إرسال الرسالة بنجاح! 📧', {
      description: 'سيتم الرد عليك خلال 24 ساعة',
      duration: 4000,
    });
  };

  const showSonnerError = () => {
    sonnerToast.error('فشل في تحميل البيانات! 🚫', {
      description: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى',
      duration: 5000,
    });
  };

  const showSonnerWarning = () => {
    sonnerToast.warning('تحذير: مساحة التخزين منخفضة! ⚠️', {
      description: 'متبقي 15% فقط من مساحة التخزين',
      duration: 6000,
    });
  };

  const showSonnerInfo = () => {
    sonnerToast.info('معلومة: تحديث جديد متاح! 🆕', {
      description: 'الإصدار 2.1.0 يحتوي على ميزات جديدة',
      duration: 4000,
    });
  };

  const showSonnerLoading = () => {
    const loadingToast = sonnerToast.loading('جاري تحميل البيانات... ⏳');
    
    // Simulate loading completion
    setTimeout(() => {
      sonnerToast.success('تم تحميل البيانات بنجاح! ✅', {
        id: loadingToast,
      });
    }, 3000);
  };

  const showSonnerPromise = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve({ name: 'أحمد محمد' }), 2000);
    });

    sonnerToast.promise(promise, {
      loading: 'جاري حفظ الملف الشخصي... 💾',
      success: (data: any) => `تم حفظ ملف ${data.name} بنجاح! 🎉`,
      error: 'فشل في حفظ الملف الشخصي 😞',
    });
  };

  const showSonnerCustom = () => {
    sonnerToast.custom((t) => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6" />
          <div>
            <h3 className="font-bold">مبروك! لديك هدية! 🎁</h3>
            <p className="text-sm opacity-90">حصلت على خصم 20% على طلبك القادم</p>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => sonnerToast.dismiss(t)}
            className="ml-auto"
          >
            إغلاق
          </Button>
        </div>
      </div>
    ), {
      duration: 8000,
    });
  };

  const showSonnerAction = () => {
    sonnerToast('رسالة جديدة من الطبيب! 👨‍⚕️', {
      description: 'د. أحمد علي أرسل لك رسالة حول وصفتك الطبية',
      action: {
        label: 'عرض الرسالة',
        onClick: () => sonnerToast.success('تم فتح الرسالة! 📖'),
      },
      duration: 10000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center shadow-glow">
              <Bell className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              اختبار الإشعارات
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            تجربة جميع أنواع الإشعارات والتنبيهات في النظام
          </p>
        </div>

        {/* Static Alerts */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              التنبيهات الثابتة
            </CardTitle>
            <CardDescription>
              تنبيهات تظهر بشكل دائم في الصفحة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>نجح العمل!</AlertTitle>
              <AlertDescription>
                تم حفظ إعداداتك بنجاح. جميع التغييرات سارية المفعول الآن.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>خطأ في النظام!</AlertTitle>
              <AlertDescription>
                حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Custom Toast Notifications */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              إشعارات Toast المخصصة
            </CardTitle>
            <CardDescription>
              إشعارات منبثقة باستخدام نظام Toast المخصص
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={showSuccessToast}
                variant="default"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                إشعار نجاح
              </Button>
              
              <Button 
                onClick={showErrorToast}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                إشعار خطأ
              </Button>
              
              <Button 
                onClick={showInfoToast}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                إشعار معلومات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sonner Toast Notifications */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              إشعارات Sonner المتقدمة
            </CardTitle>
            <CardDescription>
              إشعارات متقدمة مع رسوم متحركة وتفاعل أفضل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Sonner Toasts */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">الإشعارات الأساسية</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={showSonnerSuccess} variant="default" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  نجاح
                </Button>
                <Button onClick={showSonnerError} variant="destructive" size="sm">
                  <XCircle className="w-4 h-4 mr-2" />
                  خطأ
                </Button>
                <Button onClick={showSonnerWarning} variant="outline" size="sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  تحذير
                </Button>
                <Button onClick={showSonnerInfo} variant="secondary" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  معلومات
                </Button>
              </div>
            </div>

            {/* Advanced Sonner Toasts */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">الإشعارات المتقدمة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button onClick={showSonnerLoading} variant="outline" size="sm">
                  ⏳ تحميل
                </Button>
                <Button onClick={showSonnerPromise} variant="outline" size="sm">
                  🔄 وعد
                </Button>
                <Button onClick={showSonnerCustom} variant="outline" size="sm">
                  🎨 مخصص
                </Button>
                <Button onClick={showSonnerAction} variant="outline" size="sm">
                  ⚡ مع إجراء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Dialog */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              مربعات الحوار التفاعلية
            </CardTitle>
            <CardDescription>
              مربعات حوار تتطلب تفاعل المستخدم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  فتح مربع حوار
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات نهائياً من الخادم.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => sonnerToast.success('تم تنفيذ الإجراء بنجاح! ✅')}
                  >
                    متابعة
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              إحصائيات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <Badge variant="default" className="text-lg px-4 py-2">5</Badge>
                <p className="text-sm text-muted-foreground">أنواع Toast</p>
              </div>
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">4</Badge>
                <p className="text-sm text-muted-foreground">أنواع Sonner</p>
              </div>
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-lg px-4 py-2">2</Badge>
                <p className="text-sm text-muted-foreground">تنبيهات ثابتة</p>
              </div>
              <div className="text-center space-y-2">
                <Badge variant="destructive" className="text-lg px-4 py-2">1</Badge>
                <p className="text-sm text-muted-foreground">مربع حوار</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationTest;