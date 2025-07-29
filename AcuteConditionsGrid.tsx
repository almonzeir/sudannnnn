import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Heart, Info } from 'lucide-react';

interface AcuteCondition {
  name: string;
  symptoms: string[];
  homecare: string[];
  warning: string;
}

interface AcuteConditionsGridProps {
  conditions: AcuteCondition[];
}

export const AcuteConditionsGrid = ({ conditions }: AcuteConditionsGridProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {conditions.map((condition, index) => (
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
              <h4 className="font-semibold mb-3 flex items-center gap-2"><Info className="w-4 h-4 text-info" />الأعراض:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mr-6">{condition.symptoms.map((symptom, idx) => (<li key={idx}>• {symptom}</li>))}</ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-success" />الرعاية المنزلية:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mr-6">{condition.homecare.map((care, idx) => (<li key={idx}>• {care}</li>))}</ul>
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
  );
};