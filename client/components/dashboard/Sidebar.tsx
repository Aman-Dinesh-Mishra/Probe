"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Terminal, ShieldCheck, History, Settings, Code2 } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <Terminal size={18} />,
      label: "Workspace",
      href: "/workspace",
    },
    {
      icon: <ShieldCheck size={18} />,
      label: "Validations",
      href: "/validations",
    },
    {
      icon: <History size={18} />,
      label: "History",
      href: "/history",
    },
  ];

  return (
    <aside
      className={cn(
        "h-full border-r bg-card transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0",
      )}
    >
      <div className="h-16 flex items-center px-6 border-b gap-3">
        <Image
          src="/Probe Icon.png"
          alt="Probe Logo"
          width={28}
          height={28}
          className="rounded-sm"
        />
        <span className="font-bold tracking-wide">PROBE ENGINE</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sandbox Active</span>
        </div>
      </div>
    </aside>
  );
}
