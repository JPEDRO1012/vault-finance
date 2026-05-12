import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#070914]">
      <Sidebar />

      <main className="w-full p-4 lg:p-8">
        <Topbar />
        {children}
      </main>
    </div>
  );
}