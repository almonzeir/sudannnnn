import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <Card className="max-w-2xl mx-auto bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email ?? ""} />
              <AvatarFallback className="text-3xl">
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">
                {user.user_metadata.full_name || "ملف المستخدم"}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">معلومات الحساب</h3>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <p><strong>المعرف:</strong> <span className="font-mono text-xs">{user.id}</span></p>
              <p><strong>آخر تسجيل دخول:</strong> {new Date(user.last_sign_in_at || "").toLocaleString('ar-EG')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;