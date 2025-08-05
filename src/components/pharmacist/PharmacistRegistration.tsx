import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { GraduationCap, FileText, Calendar, User } from 'lucide-react';

interface PharmacistFormData {
  license_number: string;
  university: string;
  graduation_year: number;
  specialization: string;
}

const PharmacistRegistration: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [formData, setFormData] = useState<PharmacistFormData>({
    license_number: '',
    university: '',
    graduation_year: new Date().getFullYear(),
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduation_year' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!formData.license_number || !formData.university || !formData.graduation_year) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.graduation_year < 1950 || formData.graduation_year > new Date().getFullYear()) {
      toast.error('يرجى إدخال سنة تخرج صحيحة');
      return;
    }

    setLoading(true);

    try {
      // Check if user already has a pharmacist application
      const { data: existingApplication, error: checkError } = await supabase
        .from('pharmacists')
        .select('id, status')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing application:', checkError);
        toast.error('خطأ في التحقق من الطلبات السابقة');
        return;
      }

      if (existingApplication) {
        toast.error('لديك طلب مقدم بالفعل');
        setSubmitted(true);
        return;
      }

      // Submit pharmacist application
      const { error: insertError } = await supabase
        .from('pharmacists')
        .insert({
          user_id: user.id,
          license_number: formData.license_number,
          university: formData.university,
          graduation_year: formData.graduation_year,
          specialization: formData.specialization || null,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error submitting application:', insertError);
        toast.error('خطأ في تقديم الطلب');
        return;
      }

      toast.success('تم تقديم طلبك بنجاح! سيتم مراجعته من قبل الإدارة');
      setSubmitted(true);
      
      // Refresh user profile
      await refreshUserProfile();
    } catch (error) {
      console.error('Error submitting pharmacist application:', error);
      toast.error('خطأ في تقديم الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">تسجيل الدخول مطلوب</h2>
              <p className="text-gray-600">يجب تسجيل الدخول أولاً لتقديم طلب الصيدلي</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile?.role === 'pharmacist') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">أنت صيدلي معتمد</h2>
              <p className="text-gray-600">تم قبول طلبك وأصبحت صيدلياً معتمداً في المنصة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">تم تقديم الطلب</h2>
              <p className="text-gray-600">طلبك قيد المراجعة من قبل الإدارة. سيتم إشعارك عند الموافقة عليه.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-2">
            <GraduationCap className="w-8 h-8 inline-block mr-2" />
            طلب انضمام كصيدلي
          </CardTitle>
          <p className="text-gray-600 text-center">
            املأ النموذج أدناه لتقديم طلب الانضمام كصيدلي معتمد
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  رقم الترخيص *
                </Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم ترخيص الصيدلة"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university" className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  الجامعة *
                </Label>
                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="اسم الجامعة"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduation_year" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  سنة التخرج *
                </Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  min="1950"
                  max={new Date().getFullYear()}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">
                  التخصص (اختياري)
                </Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="مثل: صيدلة إكلينيكية، صيدلة صناعية"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">ملاحظات مهمة:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• سيتم مراجعة طلبك من قبل الإدارة</li>
                <li>• تأكد من صحة جميع البيانات المدخلة</li>
                <li>• قد تستغرق عملية المراجعة من 1-3 أيام عمل</li>
                <li>• سيتم إشعارك عبر البريد الإلكتروني عند الموافقة</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري التقديم...
                </>
              ) : (
                'تقديم الطلب'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacistRegistration;