import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Pill, 
  AlertCircle, 
  Clock, 
  Thermometer,
  Heart,
  Brain,
  Shield,
  Info,
  Star,
  BookOpen,
  Archive,
  X
} from "lucide-react";

interface Medication {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  storage: string;
  price?: string;
  availability: 'متوفر' | 'غير متوفر' | 'محدود';
  rating: number;
  image?: string;
}

const Medications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const categories = [
    { id: 'all', name: 'جميع الفئات', icon: BookOpen },
    { id: 'pain', name: 'مسكنات الألم', icon: Heart },
    { id: 'antibiotics', name: 'المضادات الحيوية', icon: Shield },
    { id: 'diabetes', name: 'أدوية السكري', icon: Thermometer },
    { id: 'heart', name: 'أدوية القلب', icon: Heart },
    { id: 'mental', name: 'الصحة النفسية', icon: Brain },
    { id: 'vitamins', name: 'الفيتامينات', icon: Star },
  ];

  const medications: Medication[] = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.arabicName.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const acuteConditions = [
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

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <Badge variant="outline" className="inline-flex items-center gap-2">
            <Pill className="w-4 h-4" />
            دليل الأدوية الشامل
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            قاعدة بيانات الأدوية
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            معلومات شاملة ومحدثة عن الأدوية المتوفرة في السودان
          </p>
        </div>

        <Tabs defaultValue="medications" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              الأدوية
            </TabsTrigger>
            <TabsTrigger value="acute" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              الحالات الطارئة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-8">
            {/* Search and Filters */}
            <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن دواء..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 bg-background/50 border-primary/20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48 bg-background/50 border-primary/20">
                        <Filter className="w-4 h-4 ml-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedications.map((medication, index) => (
                <Card 
                  key={medication.id}
                  className="group bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMedication(medication)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {medication.arabicName}
                        </CardTitle>
                        <Badge 
                          variant={medication.availability === 'متوفر' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {medication.availability}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{medication.rating}</span>
                        </div>
                        {medication.price && (
                          <p className="text-xs text-muted-foreground mt-1">{medication.price}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm leading-relaxed">
                      {medication.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">الاستخدامات الرئيسية:</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 mr-6">
                        {medication.uses.slice(0, 2).map((use, idx) => (
                          <li key={idx}>• {use}</li>
                        ))}
                        {medication.uses.length > 2 && (
                          <li className="text-primary">و {medication.uses.length - 2} استخدامات أخرى...</li>
                        )}
                      </ul>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full group-hover:border-primary/60">
                      <Info className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMedications.length === 0 && (
              <Card className="bg-gradient-card border-primary/20 text-center py-12">
                <CardContent>
                  <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">لم يتم العثور على أدوية تطابق البحث</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="acute" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {acuteConditions.map((condition, index) => (
                <Card 
                  key={index}
                  className="bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-warning" />
                      {condition.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-info" />
                        الأعراض:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mr-6">
                        {condition.symptoms.map((symptom, idx) => (
                          <li key={idx}>• {symptom}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-success" />
                        الرعاية المنزلية:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mr-6">
                        {condition.homecare.map((care, idx) => (
                          <li key={idx}>• {care}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-destructive mb-1">تحذير مهم:</h4>
                          <p className="text-sm text-destructive/80">{condition.warning}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Medication Detail Modal */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-card border-primary/20 shadow-medical">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedMedication.arabicName}</CardTitle>
                  <CardDescription className="text-lg mt-1">{selectedMedication.name}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedMedication(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      الاستخدامات:
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground mr-6">
                      {selectedMedication.uses.map((use, idx) => (
                        <li key={idx}>• {use}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-info" />
                      الجرعة:
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedMedication.dosage}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Archive className="w-5 h-5 text-warning" />
                      التخزين:
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedMedication.storage}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      الآثار الجانبية:
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground mr-6">
                      {selectedMedication.sideEffects.map((effect, idx) => (
                        <li key={idx}>• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-destructive" />
                      موانع الاستعمال:
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground mr-6">
                      {selectedMedication.contraindications.map((contra, idx) => (
                        <li key={idx}>• {contra}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={selectedMedication.availability === 'متوفر' ? 'default' : 'destructive'}
                  >
                    {selectedMedication.availability}
                  </Badge>
                  {selectedMedication.price && (
                    <span className="text-sm text-muted-foreground">{selectedMedication.price}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-medium">{selectedMedication.rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Medications;