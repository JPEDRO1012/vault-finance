import { redirect } from "next/navigation";
import { Toaster } from "sonner";
export default function Home() {
  redirect("/dashboard");
}