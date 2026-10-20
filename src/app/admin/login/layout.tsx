import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-crypto p-4">
      {children}
    </div>
  );
}
