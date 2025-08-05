import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Clock, CheckCircle, User, Calendar, FileText, Settings } from "lucide-react";

export default function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState('questions');

  // Mock data for demonstration
  const questions = [
    { 
      id: 1, 
      patient: "مريم أحمد", 
      question: "هل يمكن تناول دواء الباراسيتامول مع المضاد الحيوي أموكسيسيلين؟", 
      category: "التداخلات الدوائية",
      status: "pending",
      time: "منذ 10 دقائق"
    },
    { 
      id: 2, 
      patient: "محمد علي", 
      question: "ما هي الجرعة المناسبة من دواء الأسبرين للأطفال؟", 
      category: "الجرعات",
      status: "pending",
      time: "منذ 30 دقيقة"
    },
    { 
      id: 3, 
      patient: "خالد عمر", 
      question: "هل يمكن استخدام دواء لوراتادين أثناء الحمل؟", 
      category: "الحمل والرضاعة",
      status: "answered",
      time: "منذ 3 ساعات"
    },
  ];

  const appointments = [
    {
      id: 1,
      patient: "سارة محمد",
      date: "15 أكتوبر 2023",
      time: "10:00 صباحاً",
      type: "استشارة عن بعد",
      status: "upcoming"
    },
    {
      id: 2,
      patient: "أحمد إبراهيم",
      date: "16 أكتوبر 2023",
      time: "2:30 مساءً",
      type: "استشارة عن بعد",
      status: "upcoming"
    }
  ];

  return (
    <div className="p-6 font-arabic min-h-screen bg-background/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">لوحة تحكم الصيدلي</h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة تحكم الصيدلي</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
            <CheckCircle className="w-4 h-4 text-success" />
            صيدلي معتمد
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الأسئلة الجديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">أسئلة تنتظر الرد</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">المواعيد القادمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">خلال الأسبوع القادم</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الاستشارات المقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-sm text-muted-foreground">إجمالي الاستشارات</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              الأسئلة
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              المواعيد
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الملف الشخصي
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">الأسئلة الواردة</CardTitle>
                <CardDescription>الأسئلة التي تنتظر الرد منك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <Card key={question.id} className={`border ${question.status === 'pending' ? 'border-warning/20' : 'border-success/20'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10">
                              <User className="w-5 h-5 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{question.patient}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {question.time}
                              </div>
                            </div>
                            <p className="text-sm mb-2">{question.question}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">{question.category}</Badge>
                              {question.status === 'pending' ? (
                                <Button size="sm" variant="medical">
                                  <MessageCircle className="w-3 h-3 ml-1" />
                                  الرد الآن
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-success border-success/20 bg-success/10">تم الرد</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">المواعيد القادمة</CardTitle>
                <CardDescription>جدول المواعيد الخاص بك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{appointment.patient}</h4>
                              <Badge variant="outline" className="text-xs">{appointment.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <FileText className="w-3 h-3 ml-1" />
                                التفاصيل
                              </Button>
                              <Button size="sm" variant="medical">
                                <MessageCircle className="w-3 h-3 ml-1" />
                                بدء الاستشارة
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">الملف الشخصي</CardTitle>
                <CardDescription>إدارة معلومات حسابك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-xl">
                      <User className="w-10 h-10 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">د. أحمد محمد علي</h3>
                    <p className="text-muted-foreground">صيدلة إكلينيكية</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                    صيدلي معتمد
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الاسم الكامل</label>
                    <input type="text" className="w-full p-2 rounded-md border border-border bg-background" defaultValue="د. أحمد محمد علي" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                    <input type="email" className="w-full p-2 rounded-md border border-border bg-background" defaultValue="ahmed@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">التخصص</label>
                    <input type="text" className="w-full p-2 rounded-md border border-border bg-background" defaultValue="صيدلة إكلينيكية" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">رقم الهاتف</label>
                    <input type="tel" className="w-full p-2 rounded-md border border-border bg-background" defaultValue="+249 123 456 789" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">نبذة مختصرة</label>
                    <textarea className="w-full p-2 rounded-md border border-border bg-background h-24" defaultValue="صيدلي إكلينيكي متخصص في الأدوية المزمنة والتداخلات الدوائية. خبرة 12 عام في مجال الصيدلة الإكلينيكية وصيدلة المستشفيات."></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">إلغاء</Button>
                  <Button>حفظ التغييرات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}