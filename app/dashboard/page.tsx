import { UserProfile } from "@/components/user-profile"
import { PropertyList } from "@/components/property-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Личный кабинет</h1>
        <Button asChild>
          <Link href="/add-property">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить объект
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="properties">Мои объекты</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="mt-6">
              <PropertyList />
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <DashboardStats />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <UserProfile />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/add-property">
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить объект
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Создать отчет
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
