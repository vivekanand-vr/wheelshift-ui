import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface WidgetErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const WidgetError = ({
  title = "Error Loading Data",
  message = "Unable to load widget data. Please try again.",
  onRetry,
}: WidgetErrorProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="text-destructive mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </Card>
  );
};
