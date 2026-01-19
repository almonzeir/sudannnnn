import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "lucide-react";
import type { Medication } from "@/types";
import { cn } from "@/lib/utils";

interface MedicationCardProps {
  medication: Medication;
  index: number;
  onClick?: () => void;
}

export const MedicationCard = ({ medication, index, onClick }: MedicationCardProps) => {
  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "bg-gradient-card border-primary/20 transition-all duration-300 animate-fade-in-up h-full flex flex-col",
        onClick
          ? "cursor-pointer hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          : "cursor-default"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-3 mb-2">
          <Pill className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">{medication.arabicName}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{medication.name}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
          {medication.description}
        </p>
      </CardContent>
    </Card>
  );
};
