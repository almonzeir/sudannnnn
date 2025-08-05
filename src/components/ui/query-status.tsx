import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, Archive } from "lucide-react";

interface QueryStatusProps {
  isLoading: boolean;
  isError: boolean;
  data: unknown[] | undefined;
  loadingMessage: string;
  errorMessage: string;
  emptyMessage: string;
}

export const QueryStatus = ({ isLoading, isError, data, loadingMessage, errorMessage, emptyMessage }: QueryStatusProps) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-12">
        <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
        <p className="mt-4 text-lg text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-full bg-destructive/10 border-destructive/20 text-center py-12">
        <CardContent>
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-destructive">{errorMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full bg-gradient-card border-primary/20 text-center py-12">
        <CardContent>
          <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
};