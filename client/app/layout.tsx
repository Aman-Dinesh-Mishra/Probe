import "./globals.css";

export const metadata = {
  title: "Probe",
  description: "AI Powered Debugging Assistant",
  icons: {
    icon: "/Probe Icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
