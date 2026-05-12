type Props = {
  value: number;
};

export function ProgressBar({ value }: Props) {
  return (
    <div className="h-3 w-full rounded-full bg-white/10">
      <div
        className="h-3 rounded-full bg-violet-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}