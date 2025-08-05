import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Users, PieChart, Settings, Search, CheckCircle, AlertCircle, User } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  // Mock data for demonstration
  const users = [
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "patient", status: "active" },
    { id: 2, name: "فاطمة علي", email: "fatima@example.com", role: "pharmacist", status: "pending" },
    { id: 3, name: "محمد إبراهيم", email: "mohamed@example.com", role: "pharmacist", status: "active" },
    { id: 4, name: "سارة خالد", email: "sara@example.com", role: "patient", status: "active" },
  ];

  return (
    <div className="p-6 font-arabic min-h-screen bg-background/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">لوحة تحكم المسؤول</h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة تحكم المسؤول</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
            <Shield className="w-4 h-4 text-primary" />
            مسؤول النظام
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">إدارة المستخدمين</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="بحث عن مستخدم..." className="pr-10" />
                  </div>
                </div>
                <CardDescription>إدارة حسابات المستخدمين والصيادلة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 font-medium">المستخدم</th>
                        <th className="text-right py-3 px-4 font-medium">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4 font-medium">الدور</th>
                        <th className="text-right py-3 px-4 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.role === "pharmacist" ? "outline" : "secondary"} className="font-normal">
                              {user.role === "pharmacist" ? "صيدلي" : "مريض"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {user.status === "active" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-success">نشط</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-warning" />
                                  <span className="text-warning">قيد المراجعة</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">عرض</Button>
                              {user.status === "pending" && (
                                <Button variant="outline" size="sm" className="text-success border-success hover:bg-success/10">
                                  قبول
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">إجمالي المستخدمين</CardTitle>
                  <CardDescription>عدد المستخدمين المسجلين</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">1,245</div>
                  <p className="text-sm text-success mt-2">+12% من الشهر الماضي</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">الصيادلة النشطين</CardTitle>
                  <CardDescription>عدد الصيادلة المعتمدين</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">48</div>
                  <p className="text-sm text-success mt-2">+5% من الشهر الماضي</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">الاستشارات</CardTitle>
                  <CardDescription>عدد الاستشارات المقدمة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">3,782</div>
                  <p className="text-sm text-success mt-2">+18% من الشهر الماضي</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">إعدادات النظام</CardTitle>
                <CardDescription>تعديل إعدادات النظام الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الموقع</label>
                  <Input defaultValue="دار الدواء السوداني" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني للدعم</label>
                  <Input defaultValue="support@sudani-dar-meds.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف للتواصل</label>
                  <Input defaultValue="+249 123 456 789" />
                </div>
                <Button className="mt-4">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}