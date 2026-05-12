export function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-64 rounded-xl bg-white/10" />

        <div className="mt-3 h-4 w-96 rounded-xl bg-white/5" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-3xl bg-white/5"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-3xl bg-white/5" />

        <div className="h-96 rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}