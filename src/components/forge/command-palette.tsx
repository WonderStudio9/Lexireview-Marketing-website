"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search as SearchIcon,
  Users,
  Building2,
  Contact as ContactIcon,
  Briefcase,
  FileText,
  Loader2,
  CornerDownLeft,
} from "lucide-react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchResults = {
  leads: { id: string; email: string; tier: string; firstName?: string | null; lastName?: string | null }[]
  accounts: { id: string; name: string; domain?: string | null; tier: string }[]
  contacts: {
    id: string
    firstName: string
    lastName?: string | null
    email?: string | null
    title?: string | null
  }[]
  deals: { id: string; name: string; stage: string; valueINR: number }[]
  blogPosts: { id: string; slug: string; title: string }[]
}

type FlatItem = {
  group: string
  id: string
  label: string
  sublabel?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flatten(r: SearchResults): FlatItem[] {
  const items: FlatItem[] = []

  for (const lead of r.leads) {
    const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ")
    items.push({
      group: "Leads",
      id: `lead-${lead.id}`,
      label: lead.email,
      sublabel: [name, lead.tier].filter(Boolean).join(" · "),
      href: `/forge/leads`,
      icon: Users,
    })
  }
  for (const acc of r.accounts) {
    items.push({
      group: "Accounts",
      id: `acc-${acc.id}`,
      label: acc.name,
      sublabel: [acc.domain, acc.tier].filter(Boolean).join(" · "),
      href: `/forge/accounts`,
      icon: Building2,
    })
  }
  for (const c of r.contacts) {
    const name = [c.firstName, c.lastName].filter(Boolean).join(" ")
    items.push({
      group: "Contacts",
      id: `ct-${c.id}`,
      label: name || c.email || "Contact",
      sublabel: [c.title, c.email].filter(Boolean).join(" · "),
      href: `/forge/contacts`,
      icon: ContactIcon,
    })
  }
  for (const d of r.deals) {
    items.push({
      group: "Deals",
      id: `deal-${d.id}`,
      label: d.name,
      sublabel: d.stage,
      href: `/forge/deals`,
      icon: Briefcase,
    })
  }
  for (const p of r.blogPosts) {
    items.push({
      group: "Blog posts",
      id: `post-${p.id}`,
      label: p.title,
      sublabel: `/blog/${p.slug}`,
      href: `/blog/${p.slug}`,
      icon: FileText,
    })
  }

  return items
}

function groupBy(items: FlatItem[]): { group: string; items: FlatItem[] }[] {
  const map = new Map<string, FlatItem[]>()
  for (const i of items) {
    if (!map.has(i.group)) map.set(i.group, [])
    map.get(i.group)!.push(i)
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<SearchResults | null>(null)
  const [activeIdx, setActiveIdx] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Global Cmd/Ctrl+K toggle
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Reset when closing
  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setResults(null)
      setActiveIdx(0)
    } else {
      // focus input after open
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  // Debounced fetch
  React.useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((data: SearchResults) => {
          setResults(data)
          setActiveIdx(0)
          setLoading(false)
        })
        .catch((e) => {
          if (e.name !== "AbortError") setLoading(false)
        })
    }, 180)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  const flat = results ? flatten(results) : []
  const grouped = groupBy(flat)

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      const item = flat[activeIdx]
      if (item) {
        e.preventDefault()
        router.push(item.href)
        setOpen(false)
      }
    }
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            "fixed inset-0 isolate z-50 bg-black/50 duration-100",
            "supports-backdrop-filter:backdrop-blur-sm",
            "data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <BaseDialog.Popup
          onKeyDown={onKeyDown}
          className={cn(
            "fixed top-[20%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 outline-none",
            "rounded-xl bg-slate-900 text-white ring-1 ring-white/[0.08] shadow-2xl",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          )}
        >
          <BaseDialog.Title className="sr-only">Global search</BaseDialog.Title>
          <BaseDialog.Description className="sr-only">
            Search leads, accounts, contacts, deals and blog posts.
          </BaseDialog.Description>

          {/* Input */}
          <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-white/[0.06]">
            <SearchIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads, accounts, contacts, deals, posts..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
            />
            {loading && <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 h-5 rounded bg-white/[0.05] ring-1 ring-white/[0.08] text-[10px] text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {!query && (
              <div className="px-4 py-10 text-center text-xs text-slate-500">
                Type to search across your dashboard.
                <div className="mt-2 text-[11px] text-slate-600">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] ring-1 ring-white/[0.06] font-mono">↑↓</kbd>{" "}
                  navigate{"  "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] ring-1 ring-white/[0.06] font-mono">↵</kbd>{" "}
                  open
                </div>
              </div>
            )}

            {query && query.trim().length < 2 && (
              <div className="px-4 py-10 text-center text-xs text-slate-500">
                Type at least 2 characters.
              </div>
            )}

            {query.trim().length >= 2 && !loading && flat.length === 0 && (
              <div className="px-4 py-10 text-center text-xs text-slate-500">
                No results found for &ldquo;{query}&rdquo;.
              </div>
            )}

            {grouped.map((g) => (
              <div key={g.group} className="mb-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {g.group}
                </div>
                {g.items.map((item) => {
                  const idx = flat.findIndex((i) => i.id === item.id)
                  const active = idx === activeIdx
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        router.push(item.href)
                        setOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "bg-teal-500/10 text-white"
                          : "text-slate-200 hover:bg-white/[0.03]",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          active ? "text-teal-400" : "text-slate-400",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.label}</div>
                        {item.sublabel && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.sublabel}
                          </div>
                        )}
                      </div>
                      {active && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
