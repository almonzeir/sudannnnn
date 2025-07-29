import {
    BookOpen,
    Heart,
    Shield,
    Thermometer,
    Brain,
    Star,
  } from "lucide-react";
  import type { Medication } from "@/types";
  
  export const categories = [
    { id: "all", name: "جميع الفئات", icon: BookOpen },
    { id: "pain", name: "مسكنات الألم", icon: Heart },
    { id: "antibiotics", name: "المضادات الحيوية", icon: Shield },
    { id: "diabetes", name: "أدوية السكري", icon: Thermometer },
    { id: "heart", name: "أدوية القلب", icon: Heart },
    { id: "mental", name: "الصحة النفسية", icon: Brain },
    { id: "vitamins", name: "الفيتامينات", icon: Star },
  ];
  
  export const medicationsData: Medication[] = [
    {
      id: "1",
      name: "Paracetamol",
      arabicName: "باراسيتامول",
      category: "pain",
      description: "مسكن للألم وخافض للحرارة آمن للاستخدام العام",
      uses: ["آلام الأسنان", "آلام الصداع", "آلام المفاصل"],
      dosage: "500-1000 ملغ كل 6-8 ساعات",
      sideEffects: ["نادراً: مشاكل في الكبد عند الجرعات العالية"],
      contraindications: ["حساسية للباراسيتامول"],
      storage: "يُحفظ في درجة حرارة الغرفة بعيداً عن الرطوبة",
      price: "5-15 جنيه سوداني",
      availability: "متوفر",
      rating: 4.8,
    },
    // … أضف المزيد حسب الحاجة
  ];
  