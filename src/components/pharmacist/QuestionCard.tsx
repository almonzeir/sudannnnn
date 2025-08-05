import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface Question {
  id: string;
  patient_id: string;
  question: string;
  category: string;
  created_at: string;
  status: 'pending' | 'answered' | 'in-progress';
  urgent: boolean;
  patient_name?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard = ({ question, index }: QuestionCardProps) => {
  return (
    <Card
      key={question.id}
      className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{question.patient_name}</CardTitle>
              {question.urgent && (
                <Badge variant="destructive" className="text-xs">
                  عاجل
                </Badge>
              )}
              <Badge
                variant={
                  question.status === 'answered' ? 'default' :
                  question.status === 'in-progress' ? 'secondary' :
                  'outline'
                }
                className="text-xs"
              >
                {question.status === 'answered' ? 'تم الرد' :
                 question.status === 'in-progress' ? 'جاري الرد' : 'في الانتظار'}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {question.category}
            </Badge>
          </div>
          <div className="text-left text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(question.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {question.question}
        </CardDescription>
        {question.status === 'pending' && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              في انتظار الرد من أحد الصيادلة المتخصصين
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};