import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  color?: string;
}

const StatCard = ({ icon: Icon, label, value, description, color = "primary" }: StatCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground text-body">{label}</p>
          <p className="text-2xl font-bold mt-1 text-foreground text-body">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 text-body">{description}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
