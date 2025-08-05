import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface MedicationFiltersProps {
  searchQuery: string;
  setSearchQuery(value: string): void;
  selectedCategory: string;
  setSelectedCategory(value: string): void;
  categories: { id: string; name: string; icon: React.ElementType }[];
}

export const MedicationFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MedicationFiltersProps) => {
  return (
    <Card className="bg-gradient-card border-primary/20 shadow-medical backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Field */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن دواء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-background/50 border-primary/20"
            />
          </div>

          {/* Category Select */}
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-48"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <cat.icon className="w-4 h-4 inline-block mr-2" />
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};