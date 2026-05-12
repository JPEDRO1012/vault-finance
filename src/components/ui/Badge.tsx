import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "default";
};

export function Badge({ children, variant = "default" }: Props) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        variant === "success" && "bg-emerald-500/15 text-emerald-400",
        variant === "danger" && "bg-red-500/15 text-red-400",
        variant === "warning" && "bg-yellow-500/15 text-yellow-400",
        variant === "default" && "bg-white/10 text-zinc-300"
      )}
    >
      {children}
    </span>
  );
}