import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Section component for organizing page content
 */
export function Section({
  children,
  className,
  title,
  description,
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <Typography
              variant="large"
              className="font-semibold tracking-tight"
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="muted" className="text-sm">
              {description}
            </Typography>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
