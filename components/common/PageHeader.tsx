import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page header component
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center justify-between space-y-2",
        className
      )}
    >
      <div>
        <Typography variant="h2" className="text-3xl tracking-tight">
          {title}
        </Typography>
        {description && (
          <Typography variant="muted" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
