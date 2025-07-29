import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, MessageCircle, BookOpen, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm text-center animate-fade-in-up">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            الصفحة المطلوبة غير موجودة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. 
            قد تكون الصفحة قد تم نقلها أو حذفها.
          </p>
          
          <div className="space-y-3">
            <Button size="lg" variant="medical" asChild className="w-full">
              <Link to="/">
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/chatbot">
                  <MessageCircle className="w-4 h-4 ml-1" />
                  المساعد الذكي
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link to="/medications">
                  <BookOpen className="w-4 h-4 ml-1" />
                  دليل الأدوية
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;