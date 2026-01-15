import { useState, useEffect } from "react";
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
  X,
  Loader2
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface Medication {
  _id: string;
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
  availability: string;
  rating: number;
  image?: string;
}

const Medications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Fetch data from Convex
  const medications = useQuery(api.medications.list, {
    search: searchQuery,
    category: selectedCategory
  });

  const acuteConditions = useQuery(api.acuteConditions.list);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMedication(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const categories = [
    { id: 'all', name: 'جميع الفئات', icon: BookOpen },
    { id: 'pain', name: 'مسكنات الألم', icon: Heart },
    { id: 'antibiotics', name: 'المضادات الحيوية', icon: Shield },
    { id: 'diabetes', name: 'أدوية السكري', icon: Thermometer },
    { id: 'heart', name: 'أدوية القلب', icon: Heart },
    { id: 'mental', name: 'الصحة النفسية', icon: Brain },
    { id: 'vitamins', name: 'الفيتامينات', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 mb-12"
        >
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
        </motion.div>

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
            <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
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
              {!medications ? (
                 // Loading Skeletons
                 Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-[300px]">
                        <CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-10 w-full mt-4" />
                        </CardContent>
                    </Card>
                 ))
              ) : medications.length > 0 ? (
                  medications.map((medication: Medication, index: number) => (
                <motion.div
                  key={medication._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                <Card 
                  tabIndex={0}
                  role="button"
                  aria-label={`عرض تفاصيل ${medication.arabicName}`}
                  className="group bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 hover:scale-105 cursor-pointer h-full flex flex-col focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  onClick={() => setSelectedMedication(medication)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMedication(medication);
                    }
                  }}
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
                  
                  <CardContent className="space-y-3 flex-1 flex flex-col">
                    <CardDescription className="text-sm leading-relaxed line-clamp-2">
                      {medication.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">الاستخدامات الرئيسية:</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 mr-6">
                        {medication.uses.slice(0, 2).map((use: string, idx: number) => (
                          <li key={idx}>• {use}</li>
                        ))}
                        {medication.uses.length > 2 && (
                          <li className="text-primary">و {medication.uses.length - 2} استخدامات أخرى...</li>
                        )}
                      </ul>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:border-primary/60">
                      <Info className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                  </CardContent>
                </Card>
                </motion.div>
              ))) : (
                <div className="col-span-full">
                <Card className="bg-gradient-card border-primary/20 text-center py-12">
                    <CardContent>
                    <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">لم يتم العثور على أدوية تطابق البحث</p>
                    </CardContent>
                </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="acute" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {!acuteConditions ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="h-[200px]">
                        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                    </Card>
                  ))
              ) : (
                acuteConditions.map((condition: { name: string; symptoms: string[]; homecare: string[]; warning: string }, index: number) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                <Card 
                  className="bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 h-full"
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
                        {condition.symptoms.map((symptom: string, idx: number) => (
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
                        {condition.homecare.map((care: string, idx: number) => (
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
                </motion.div>
              )))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Medication Detail Modal */}
      <AnimatePresence>
      {selectedMedication && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
          <Card className="w-full bg-gradient-card border-primary/20 shadow-medical">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedMedication.arabicName}</CardTitle>
                  <CardDescription className="text-lg mt-1">{selectedMedication.name}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="إغلاق"
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
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Medications;