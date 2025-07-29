import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Ban, Home } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-gradient-card border-destructive/20 shadow-lg text-center animate-fade-in-up">
        <CardHeader>
          <Ban className="w-12 h-12 text-destructive mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-lg">You do not have permission to view this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link to="/"><Home className="w-4 h-4 ml-2" />Go to Homepage</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;