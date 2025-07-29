import { useState, forwardRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, User, Star, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Pharmacist } from "@/types";

const questionCategories = [
  { value: "dosage", label: "الجرعات" },
  { value: "interactions", label: "التداخلات الدوائية" },
  { value: "side-effects", label: "الآثار الجانبية" },
  { value: "chronic", label: "الأمراض المزمنة" },
  { value: "pregnancy", label: "الحمل والرضاعة" },
  { value: "other", label: "أخرى" },
];

interface AskPharmacistFormProps {
  pharmacists: Pharmacist[];
  selectedPharmacist: string | null;
  onSelectPharmacist: (id: string | null) => void;
}

interface NewQuestion {
  question: string;
  category: string;
  pharmacist_id: string;
  patient_id: string;
  status: 'pending';
  urgent: boolean;
}

const addQuestion = async (newQuestion: NewQuestion) => {
  const { error } = await supabase.from('questions').insert(newQuestion);
  if (error) {
    throw new Error(error.message);
  }
};

export const AskPharmacistForm = forwardRef<HTMLDivElement, AskPharmacistFormProps>(({ pharmacists, selectedPharmacist, onSelectPharmacist }, ref) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: submitQuestion, isPending: isSubmitting } = useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      toast({ title: "تم إرسال السؤال بنجاح", description: "سيرد عليك الصيدلي في أقرب وقت ممكن." });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setQuestion('');
      onSelectPharmacist(null);
      setCategory('');
      setIsUrgent(false);
    },
    onError: (error) => {
      toast({ title: "خطأ في الإرسال", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmitQuestion = () => {
    if (!user) {
      toast({ title: "خطأ", description: "يجب عليك تسجيل الدخول أولاً لطرح سؤال.", variant: "destructive" });
      return;
    }
    if (!question.trim() || !category || !selectedPharmacist) {
      toast({ title: "خطأ", description: "يرجى كتابة السؤال واختيار الفئة والصيدلي", variant: "destructive" });
      return;
    }

    submitQuestion({
      question, category, pharmacist_id: selectedPharmacist, patient_id: user.id, status: 'pending', urgent: isUrgent,
    });
  };

  return (
    <Card ref={ref} className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3"><MessageCircle className="w-6 h-6 text-primary" />اطرح سؤالك</CardTitle>
        <CardDescription>اختر صيدلي واطرح سؤالك للحصول على استشارة مجانية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">اختر الصيدلي:</label>
          <div className="grid gap-4">
            {pharmacists.filter(p => p.available).map((pharmacist) => (
              <Card key={pharmacist.id} className={`cursor-pointer transition-all duration-300 border-2 ${selectedPharmacist === pharmacist.id ? 'border-primary shadow-medical' : 'border-primary/20 hover:border-primary/40'}`} onClick={() => onSelectPharmacist(pharmacist.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center"><User className="w-6 h-6 text-foreground" /></div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">{pharmacist.name}{pharmacist.verified && (<CheckCircle className="w-4 h-4 text-success" />)}</h3>
                        <p className="text-sm text-muted-foreground">{pharmacist.specialization}</p>
                      </div>
                    </div>
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /><span className="text-sm font-medium">{pharmacist.rating}</span></div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{pharmacist.responseTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="category-select" className="text-sm font-medium mb-2 block">فئة السؤال:</label>
            <Select value={category} onValueChange={setCategory}><SelectTrigger id="category-select" className="w-full bg-background/50 border-primary/20"><SelectValue placeholder="اختر الفئة" /></SelectTrigger><SelectContent>{questionCategories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select>
          </div>
          <div><label className="text-sm font-medium mb-2 block">سؤالك:</label><Textarea placeholder="اكتب سؤالك بالتفصيل..." value={question} onChange={(e) => setQuestion(e.target.value)} className="min-h-32 bg-background/50 border-primary/20 focus:border-primary/60" /></div>
          <div className="flex items-center gap-2"><Checkbox id="urgent" checked={isUrgent} onCheckedChange={(checked) => setIsUrgent(Boolean(checked))} /><label htmlFor="urgent" className="text-sm font-medium leading-none cursor-pointer">هل السؤال عاجل؟</label></div>
          <Button onClick={handleSubmitQuestion} className="w-full" variant="glow" size="lg" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-5 h-5 ml-2 animate-spin" /> : <Send className="w-5 h-5 ml-2" />}{isSubmitting ? "جاري الإرسال..." : "إرسال السؤال"}</Button>
        </div>
      </CardContent>
    </Card>
  );
});