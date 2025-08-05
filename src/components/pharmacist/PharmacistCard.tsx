import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Award, Star, MapPin, Clock, CheckCircle, MessageCircle } from "lucide-react";
import type { Pharmacist } from "@/types";

interface PharmacistCardProps {
  pharmacist: Pharmacist;
  onAskNow: (id: string) => void;
  index: number;
}

export const PharmacistCard = ({ pharmacist, onAskNow, index }: PharmacistCardProps) => {
  return (
    <Card
      key={pharmacist.id}
      className="bg-gradient-card border-primary/20 hover:border-primary/40 hover:shadow-medical transition-all duration-500 hover:scale-105 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center shadow-glow">
            <User className="w-10 h-10 text-foreground" />
          </div>
          {pharmacist.verified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-background">
              <CheckCircle className="w-5 h-5 text-foreground" />
            </div>
          )}
          <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full ${pharmacist.available ? 'bg-success' : 'bg-muted'} animate-pulse`}></div>
        </div>
        <CardTitle className="text-xl">{pharmacist.name}</CardTitle>
        <CardDescription>{pharmacist.specialization}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Award className="w-4 h-4 text-primary" /><span>{pharmacist.experience} سنة خبرة</span></div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-warning text-warning" /><span>{pharmacist.rating}/5</span></div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{pharmacist.location}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span>{pharmacist.responseTime}</span></div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">اللغات:</span>
          <div className="flex gap-1 mt-1">
            {pharmacist.languages.map((lang, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">{lang}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={pharmacist.available ? "medical" : "outline"} size="sm" className="flex-1" disabled={!pharmacist.available} onClick={() => onAskNow(pharmacist.id)}>
            <MessageCircle className="w-4 h-4 ml-2" />
            {pharmacist.available ? 'اسأل الآن' : 'غير متاح'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};