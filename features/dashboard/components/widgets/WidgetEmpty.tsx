import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { InboxIcon } from "lucide-react";

interface WidgetEmptyProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const WidgetEmpty = ({
  title = "No Data Available",
  message = "There is no data to display at this time.",
  icon,
}: WidgetEmptyProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        {icon || <InboxIcon className="text-muted-foreground mb-4 h-12 w-12" />}
        <Typography variant="large" className="mb-2">
          {title}
        </Typography>
        <Typography variant="muted" className="max-w-sm">
          {message}
        </Typography>
      </div>
    </Card>
  );
};
