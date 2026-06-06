import { Header } from "@/components/front/Header";
import { Footer } from "@/components/front/Footer";

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}
