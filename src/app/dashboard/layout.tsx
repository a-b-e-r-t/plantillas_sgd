import { auth } from "@/auth";
import Sidebar from "@/components/layout/sidebar"; 
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
