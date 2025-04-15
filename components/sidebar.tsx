"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard, PlusCircle, Settings, BarChart3, LogOut, FolderPlus, Folders } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col border-r bg-muted/40 w-64 p-4", className)}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <Home className="h-6 w-6 text-blue-600" />
        <span className="font-heading text-xl font-bold">РиелторПро</span>
      </div>

      <div className="flex items-center gap-4 px-2 py-4 mb-8">
        <Avatar className="h-10 w-10 border-2 border-blue-600">
          <AvatarImage src="/placeholder-user.jpg" alt="Аватар" />
          <AvatarFallback>ИП</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Иван Петров</p>
          <p className="text-xs text-muted-foreground">Риелтор</p>
        </div>
      </div>

      <nav className="grid gap-2 px-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/dashboard" ? "bg-blue-50 text-blue-600" : "text-muted-foreground",
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Панель управления
        </Link>
        <Link
          href="/add-property"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/add-property" ? "bg-blue-50 text-blue-600" : "text-muted-foreground",
          )}
        >
          <PlusCircle className="h-4 w-4" />
          Добавить объект
        </Link>
        <Link
          href="/collections"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/collections" || pathname.startsWith("/collections/")
              ? "bg-blue-50 text-blue-600"
              : "text-muted-foreground",
          )}
        >
          <Folders className="h-4 w-4" />
          Подборки
        </Link>
        <Link
          href="/create-collection"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/create-collection" ? "bg-blue-50 text-blue-600" : "text-muted-foreground",
          )}
        >
          <FolderPlus className="h-4 w-4" />
          Создать подборку
        </Link>
        <Link
          href="/dashboard?tab=stats"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/dashboard" && pathname.includes("stats")
              ? "bg-blue-50 text-blue-600"
              : "text-muted-foreground",
          )}
        >
          <BarChart3 className="h-4 w-4" />
          Статистика
        </Link>
        <Link
          href="/dashboard?tab=settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
            pathname === "/dashboard" && pathname.includes("settings")
              ? "bg-blue-50 text-blue-600"
              : "text-muted-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Настройки
        </Link>
      </nav>

      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  )
}
