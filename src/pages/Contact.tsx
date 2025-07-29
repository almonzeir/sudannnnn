import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      <Card className="max-w-2xl mx-auto bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">اتصل بنا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            نحن هنا للمساعدة. تواصل معنا عبر القنوات التالية.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">البريد الإلكتروني</h3>
                <a href="mailto:info@sudanimeds.com" className="text-muted-foreground hover:text-primary">
                  info@sudanimeds.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">الهاتف</h3>
                <p className="text-muted-foreground">+249 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">العنوان</h3>
                <p className="text-muted-foreground">الخرطوم، السودان</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;