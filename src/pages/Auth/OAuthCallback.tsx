import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session?.user) {
          // Check if user profile exists
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError && profileError.code === 'PGRST116') {
            // User profile doesn't exist, create one
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email!,
                full_name: data.session.user.user_metadata?.full_name || 
                          data.session.user.user_metadata?.name || 
                          data.session.user.email!.split('@')[0],
                role: 'patient' // Default role for Google sign-in
              });
            
            if (insertError) {
              console.error('Error creating user profile:', insertError);
              toast.error('حدث خطأ في إنشاء الملف الشخصي');
            }
          }
          
          toast.success('تم تسجيل الدخول بنجاح');
          navigate('/');
        } else {
          throw new Error('لم يتم العثور على جلسة المستخدم');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;