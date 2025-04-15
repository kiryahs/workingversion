"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, ArrowUpRight, ArrowDownRight, Phone, MessageSquare } from "lucide-react"
import Image from "next/image"

export function DashboardStats() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="week" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Статистика просмотров</h2>
          <TabsList>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="week" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего просмотров</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +12.5%
                  </span>{" "}
                  по сравнению с прошлой неделей
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Уникальные посетители</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">842</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +7.2%
                  </span>{" "}
                  по сравнению с прошлой неделей
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Звонки</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    -3.1%
                  </span>{" "}
                  по сравнению с прошлой неделей
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Сообщения</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +14.2%
                  </span>{" "}
                  по сравнению с прошлой неделей
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Популярные объекты</CardTitle>
              <CardDescription>Объекты с наибольшим количеством просмотров за неделю</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 overflow-hidden rounded-md">
                    <Image
                      src="/placeholder.svg"
                      alt="Объект недвижимости"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">3-комнатная квартира, 78 м²</h4>
                    <p className="text-sm text-muted-foreground">ул. Ленина, 45</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>245</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 overflow-hidden rounded-md">
                    <Image
                      src="/placeholder.svg"
                      alt="Объект недвижимости"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Дом 150 м² на участке 10 сот.</h4>
                    <p className="text-sm text-muted-foreground">пос. Сосновый Бор, ул. Лесная, 8</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>187</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 overflow-hidden rounded-md">
                    <Image
                      src="/placeholder.svg"
                      alt="Объект недвижимости"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">2-комнатная квартира, 54 м²</h4>
                    <p className="text-sm text-muted-foreground">ул. Пушкина, 12</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>142</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика за месяц</CardTitle>
              <CardDescription>Данные о просмотрах и контактах за последний месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Здесь будет отображаться статистика за месяц</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика за год</CardTitle>
              <CardDescription>Данные о просмотрах и контактах за последний год</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Здесь будет отображаться статистика за год</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
