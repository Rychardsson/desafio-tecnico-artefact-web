import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciador de Tarefas | Artefact",
  description: "Sistema de gerenciamento de tarefas desenvolvido com Next.js e tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
