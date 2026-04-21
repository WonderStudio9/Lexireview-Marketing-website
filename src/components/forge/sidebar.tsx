"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Bot,
  Clock,
  Settings,
  Menu,
  Bell,
  Search,
  Hexagon,
  Users,
  Briefcase,
  Building2,
  Contact,
  Send,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { label: "Overview", href: "/forge", icon: LayoutDashboard },
  { label: "Leads", href: "/forge/leads", icon: Users },
  { label: "Deals", href: "/forge/deals", icon: Briefcase },
  { label: "Accounts", href: "/forge/accounts", icon: Building2 },
  { label: "Contacts", href: "/forge/contacts", icon: Contact },
  { label: "Campaigns", href: "/forge/campaigns", icon: Send },
  { label: "Pipeline", href: "/forge/pipeline", icon: GitBranch },
  { label: "Analytics", href: "/forge/analytics", icon: BarChart3 },
  { label: "Agents", href: "/forge/agents", icon: Bot },
  { label: "Cron Jobs", href: "/forge/cron", icon: Clock },
  { label: "Settings", href: "/forge/settings", icon: Settings },
]

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = React.useState(false)

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch("/api/auth", { method: "DELETE" })
    } catch {
      // ignore network errors — still redirect
    } finally {
      onNavigate?.()
      router.push("/forge/login")
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/15">
          <Hexagon className="w-4.5 h-4.5 text-teal-400" />
        </div>
        <span className="text-base font-semibold text-white tracking-tight">
          LexiForge
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/forge"
              ? pathname === "/forge"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-500/15 text-teal-400"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-teal-500/20 text-teal-400 text-xs font-medium">
              PR
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@lexiforge.io</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "text-slate-400 hover:text-white hover:bg-white/[0.04]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </div>
  )
}

function getPageTitle(pathname: string): string {
  if (pathname === "/forge") return "Dashboard"
  if (pathname.startsWith("/forge/pipeline")) return "Content Pipeline"
  if (pathname.startsWith("/forge/analytics")) return "SEO / AEO / GEO Analytics"
  if (pathname.startsWith("/forge/agents")) return "Agent Activity"
  if (pathname.startsWith("/forge/cron")) return "Cron Jobs"
  if (pathname.startsWith("/forge/settings")) return "Settings"
  return "Dashboard"
}

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pageTitle = getPageTitle(pathname)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-slate-950 border-r border-white/[0.06] z-40">
        <NavContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 h-14 bg-slate-950/95 backdrop-blur-sm border-b border-white/[0.06]">
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" />}
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <span className="text-sm font-semibold text-white">{pageTitle}</span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
        <SheetContent side="left" className="w-60 p-0 bg-slate-950 border-r border-white/[0.06]">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <NavContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Top Bar */}
      <header className="hidden lg:flex items-center gap-4 fixed top-0 left-60 right-0 z-30 h-14 px-6 bg-slate-900/80 backdrop-blur-sm border-b border-white/[0.06]">
        <h1 className="text-base font-semibold text-white">{pageTitle}</h1>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            // Dispatch a synthetic Cmd/Ctrl+K to trigger the global palette.
            window.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                ctrlKey: true,
                bubbles: true,
              }),
            )
          }}
          className="relative w-64 flex items-center gap-2 h-8 pl-2.5 pr-2 rounded-md bg-white/[0.04] ring-1 ring-white/[0.06] text-sm text-slate-500 hover:text-slate-300 hover:ring-teal-500/30 transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 h-5 rounded bg-white/[0.05] ring-1 ring-white/[0.08] text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full" />
        </Button>
        <Avatar className="w-7 h-7">
          <AvatarFallback className="bg-teal-500/20 text-teal-400 text-xs font-medium">
            PR
          </AvatarFallback>
        </Avatar>
      </header>
    </>
  )
}
