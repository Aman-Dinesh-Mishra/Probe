"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, User, Menu } from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  language,
  setLanguage,
}: NavbarProps) {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("probe_token");
    router.push("/");
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
          </Button>

          <div>
            <h1 className="text-lg font-bold tracking-tight">Probe Engine</h1>

            <p className="text-xs text-muted-foreground">
              AI-Powered Debugging Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Target</span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border bg-muted px-3 py-1.5 text-xs"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="r">R</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <Badge variant="secondary" className="hidden sm:flex">
            AI Debugger
          </Badge>

          <Button variant="ghost" size="icon">
            <User size={18} />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
