import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
