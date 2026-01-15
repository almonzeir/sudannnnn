import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("acuteConditions").collect();
  },
});

export const seed = mutation({
  handler: async (ctx) => {
    const total = await ctx.db.query("acuteConditions").collect();
    if (total.length > 0) return;

    const conditions = [
        {
          name: 'الإسهال والكوليرا',
          symptoms: ['إسهال متكرر', 'جفاف', 'ألم في البطن', 'حمى'],
          homecare: ['شرب السوائل بكثرة', 'محلول الجفاف', 'تجنب الألبان', 'الراحة'],
          warning: 'راجع الطبيب فوراً في حالة الجفاف الشديد أو ارتفاع الحرارة'
        },
        {
          name: 'الملاريا',
          symptoms: ['حمى شديدة', 'قشعريرة', 'صداع', 'تعرق', 'ألم في العضلات'],
          homecare: ['شرب السوائل', 'خفض الحرارة', 'الراحة التامة'],
          warning: 'حالة طوارئ - راجع أقرب مركز صحي فوراً'
        },
        {
          name: 'الحصبة',
          symptoms: ['طفح جلدي أحمر', 'حمى', 'سعال', 'احمرار العين'],
          homecare: ['عزل المريض', 'شرب السوائل', 'خفض الحرارة', 'راحة تامة'],
          warning: 'راجع الطبيب للتأكد من التشخيص والعلاج'
        },
        {
          name: 'الحمى العامة',
          symptoms: ['ارتفاع درجة الحرارة', 'صداع', 'ألم في الجسم', 'تعب'],
          homecare: ['شرب السوائل الباردة', 'كمادات باردة', 'راحة', 'ملابس خفيفة'],
          warning: 'راجع الطبيب إذا استمرت الحمى أكثر من 3 أيام'
        }
    ];

    for (const cond of conditions) {
      await ctx.db.insert("acuteConditions", cond);
    }
  },
});
