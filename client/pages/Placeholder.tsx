import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  suggestedAction?: string;
}

export default function Placeholder({ 
  title, 
  description, 
  suggestedAction = "Continue building this feature by providing more details about what you'd like to implement here." 
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="bg-railway-blue/10 p-4 rounded-full w-fit mx-auto mb-4">
            <Construction className="h-8 w-8 text-railway-blue" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground italic">{suggestedAction}</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
