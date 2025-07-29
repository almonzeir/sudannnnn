import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import {
    X,
    Pill,
    Clock,
    Archive,
    AlertCircle,
    Shield,
  } from "lucide-react";
  import type { Medication } from "@/types";
  
  interface MedicationDetailModalProps {
    medication: Medication | null;
    onClose: () => void;
  }
  
  export const MedicationDetailModal = ({
    medication,
    onClose,
  }: MedicationDetailModalProps) => {
    if (!medication) return null;
  
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-card border-primary/20 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 sticky top-0 bg-gradient-card z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">
                  {medication.arabicName}
                </CardTitle>
                <CardDescription className="text-lg mt-1">
                  {medication.name}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X />
              </Button>
            </div>
          </CardHeader>
  
          <CardContent className="p-6 space-y-6">
            {/* Uses & Dosage */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" /> الاستخدامات:
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {medication.uses.map((u, i) => (
                    <li key={i}>• {u}</li>
                  ))}
                </ul>
              </div>
  
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-info" /> الجرعة:
                </h3>
                <p className="text-sm text-muted-foreground">
                  {medication.dosage}
                </p>
              </div>
            </div>
  
            {/* Side Effects & Contraindications */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" /> الآثار الجانبية:
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {medication.sideEffects.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
  
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" /> موانع الاستعمال:
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {medication.contraindications.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
  
            {/* Availability & Price */}
            <div className="border-t border-border/50 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{medication.availability}</Badge>
                <span className="text-sm text-muted-foreground">
                  السعر: {medication.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  