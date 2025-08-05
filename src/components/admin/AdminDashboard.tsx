import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, User, GraduationCap, Calendar } from 'lucide-react';

type PharmacistApplication = Database['public']['Tables']['pharmacists']['Row'] & {
  users?: Database['public']['Tables']['users']['Row'];
};

const AdminDashboard: React.FC = () => {
  const { role, userProfile } = useAuth();
  const [applications, setApplications] = useState<PharmacistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (role === 'admin') {
      fetchApplications();
    }
  }, [role]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacists')
        .select(`
          *,
          users (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('خطأ في جلب طلبات الصيادلة');
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('خطأ في جلب طلبات الصيادلة');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (pharmacistId: string, status: 'approved' | 'rejected') => {
    if (!userProfile?.id) {
      toast.error('خطأ في المصادقة');
      return;
    }

    setProcessingId(pharmacistId);

    try {
      const { error } = await supabase
        .from('pharmacists')
        .update({
          status,
          approved_by: userProfile.id,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', pharmacistId);

      if (error) {
        console.error('Error updating pharmacist status:', error);
        toast.error('خطأ في تحديث حالة الصيدلي');
        return;
      }

      // Update the user role if approved
      if (status === 'approved') {
        const application = applications.find(app => app.id === pharmacistId);
        if (application?.user_id) {
          const { error: userError } = await supabase
            .from('users')
            .update({ role: 'pharmacist', updated_at: new Date().toISOString() })
            .eq('id', application.user_id);

          if (userError) {
            console.error('Error updating user role:', userError);
            toast.error('خطأ في تحديث دور المستخدم');
            return;
          }
        }
      }

      toast.success(
        status === 'approved' 
          ? 'تم قبول طلب الصيدلي بنجاح' 
          : 'تم رفض طلب الصيدلي'
      );

      // Refresh applications
      await fetchApplications();
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error('خطأ في معالجة الطلب');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />مقبول</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">غير مصرح</h2>
              <p className="text-gray-600">هذه الصفحة مخصصة للمديرين فقط</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري تحميل طلبات الصيادلة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المدير</h1>
        <p className="text-gray-600">إدارة طلبات الصيادلة والموافقة عليها</p>
      </div>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
                <p className="text-gray-600">لم يتم تقديم أي طلبات من الصيادلة بعد</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {application.users?.full_name || 'غير محدد'}
                    </CardTitle>
                    <p className="text-gray-600">{application.users?.email}</p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">الجامعة:</span>
                      <span className="mr-2">{application.university}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">سنة التخرج:</span>
                      <span className="mr-2">{application.graduation_year}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">رقم الترخيص:</span>
                      <span className="mr-2">{application.license_number}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {application.specialization && (
                      <div>
                        <span className="font-medium">التخصص:</span>
                        <span className="mr-2">{application.specialization}</span>
                      </div>
                    )}
                    {application.users?.phone && (
                      <div>
                        <span className="font-medium">الهاتف:</span>
                        <span className="mr-2">{application.users.phone}</span>
                      </div>
                    )}
                    {application.users?.location && (
                      <div>
                        <span className="font-medium">الموقع:</span>
                        <span className="mr-2">{application.users.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {application.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApproval(application.id, 'approved')}
                      disabled={processingId === application.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      قبول
                    </Button>
                    <Button
                      onClick={() => handleApproval(application.id, 'rejected')}
                      disabled={processingId === application.id}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      رفض
                    </Button>
                  </div>
                )}

                {application.status !== 'pending' && application.approved_at && (
                  <div className="text-sm text-gray-500 mt-4">
                    تم {application.status === 'approved' ? 'القبول' : 'الرفض'} في: {new Date(application.approved_at).toLocaleDateString('ar-SA')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;