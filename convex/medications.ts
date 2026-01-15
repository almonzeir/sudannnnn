import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allMeds = await ctx.db.query("medications").collect();

    let result = allMeds;

    // Filter by category
    if (args.category && args.category !== 'all') {
      result = result.filter((m) => m.category === args.category);
    }

    // Filter by search query (case-insensitive, searches both English and Arabic names)
    if (args.search) {
      const search = args.search.toLowerCase();
      result = result.filter((m) =>
        m.name.toLowerCase().includes(search) ||
        m.arabicName.includes(search)
      );
    }

    return result;
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    // Keep this for potential autocomplete usage, though list handles the main search now.
    // We'll stick to the robust JS filter in 'list' for the main view.
    const results = await ctx.db
        .query("medications")
        .withSearchIndex("search_arabic_name", (q) => q.search("arabicName", args.query))
        .take(10);
    return results;
  }
});

// Seed function to populate data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const total = await ctx.db.query("medications").collect();
    if (total.length > 0) return; // Already seeded

    const medications = [
        {
          name: 'Paracetamol',
          arabicName: 'باراسيتامول',
          category: 'pain',
          description: 'مسكن للألم وخافض للحرارة آمن للاستخدام',
          uses: ['تسكين الآلام الخفيفة إلى المتوسطة', 'خفض الحرارة', 'آلام الصداع', 'آلام الأسنان'],
          dosage: '500-1000 مجم كل 6-8 ساعات (أقصى 4 جرام يومياً)',
          sideEffects: ['نادراً: طفح جلدي', 'نادراً: مشاكل في الكبد عند الجرعات العالية'],
          contraindications: ['حساسية من الباراسيتامول', 'أمراض الكبد الشديدة'],
          storage: 'يحفظ في درجة حرارة الغرفة بعيداً عن الرطوبة',
          price: '5-15 جنيه سوداني',
          availability: 'متوفر',
          rating: 4.8
        },
        {
          name: 'Amoxicillin',
          arabicName: 'أموكسيسيلين',
          category: 'antibiotics',
          description: 'مضاد حيوي واسع المدى لعلاج العدوى البكتيرية',
          uses: ['التهابات الجهاز التنفسي', 'التهابات الأذن', 'التهابات المسالك البولية', 'التهابات الجلد'],
          dosage: '250-500 مجم كل 8 ساعات لمدة 7-10 أيام',
          sideEffects: ['إسهال', 'غثيان', 'طفح جلدي', 'اضطراب في المعدة'],
          contraindications: ['حساسية من البنسلين', 'الحمل (بحذر)', 'أمراض الكلى الشديدة'],
          storage: 'يحفظ في الثلاجة للشراب، درجة حرارة الغرفة للأقراص',
          price: '25-45 جنيه سوداني',
          availability: 'متوفر',
          rating: 4.5
        },
        {
          name: 'Metformin',
          arabicName: 'ميتفورمين',
          category: 'diabetes',
          description: 'دواء أساسي لعلاج داء السكري من النوع الثاني',
          uses: ['تنظيم مستوى السكر في الدم', 'تحسين حساسية الأنسولين', 'إنقاص الوزن'],
          dosage: '500-1000 مجم مرتين يومياً مع الطعام',
          sideEffects: ['اضطراب في المعدة', 'إسهال', 'طعم معدني في الفم', 'نقص فيتامين B12'],
          contraindications: ['أمراض الكلى الشديدة', 'قصور القلب', 'إدمان الكحول'],
          storage: 'يحفظ في درجة حرارة الغرفة بعيداً عن الرطوبة',
          price: '30-60 جنيه سوداني',
          availability: 'متوفر',
          rating: 4.6
        },
        {
          name: 'Aspirin',
          arabicName: 'أسبرين',
          category: 'heart',
          description: 'مسكن ومضاد للالتهاب ومضاد لتجلط الدم',
          uses: ['تسكين الآلام', 'تقليل الالتهاب', 'منع تجلط الدم', 'الوقاية من النوبات القلبية'],
          dosage: '75-100 مجم يومياً للوقاية، 300-600 مجم للألم',
          sideEffects: ['تهيج المعدة', 'نزيف', 'طنين في الأذن', 'حرقة المعدة'],
          contraindications: ['قرحة المعدة', 'اضطرابات النزيف', 'الحساسية من الأسبرين'],
          storage: 'يحفظ في مكان بارد وجاف',
          price: '10-20 جنيه سوداني',
          availability: 'متوفر',
          rating: 4.3
        }
    ];

    for (const med of medications) {
      await ctx.db.insert("medications", med);
    }
  },
});
