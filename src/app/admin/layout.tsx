import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { decrypt } from "@/lib/auth";
import { UserAuth } from "@/lib/types";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await decrypt((await cookies()).get("token")?.value || "");
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user as unknown as UserAuth} />
      <SidebarInset>{children}</SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}
