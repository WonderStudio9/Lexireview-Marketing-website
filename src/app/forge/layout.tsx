import type { Metadata } from "next"
import { Sidebar } from "@/components/forge/sidebar"

export const metadata: Metadata = {
  title: "LexiForge Dashboard",
  description: "AI-powered content pipeline management",
}

export default function ForgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark min-h-screen bg-slate-900 text-white">
      <Sidebar />
      {/* Main content area */}
      <main className="lg:pl-60">
        <div className="pt-14 min-h-screen">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
