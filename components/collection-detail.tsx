"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CollectionPreview } from "@/components/collection-preview"
import { ArrowLeft, Share2, Edit, QrCode, Copy, Send, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

// Пример данных подборки
const mockCollection = {
  id: "1",
  title: "Квартиры для семьи Ивановых",
  description: "3-комнатные квартиры в центре города с хорошей инфраструктурой",
  clientName: "Семья Ивановых",
  clientPhone: "+7 (999) 123-45-67",
  clientEmail: "ivanov@example.com",
  expiresAt: "2023-12-31",
  createdAt: "2023-11-15",
  lastViewed: "2023-11-20",
  viewCount: 8,
  status: "active",
  propertyIds: ["1", "2", "3"],
}

interface CollectionDetailProps {
  id: string
}

export function CollectionDetail({ id }: CollectionDetailProps) {
  const [activeTab, setActiveTab] = useState("preview")

  // В реальном приложении здесь будет запрос к API для получения данных о подборке по ID
  const collection = mockCollection

  const copyCollectionLink = () => {
    const url = `${window.location.origin}/collection/${id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на подборку скопирована в буфер обмена",
    })
  }

  const sendCollectionToClient = () => {
    // Здесь будет логика отправки подборки клиенту
    toast({
      title: "Подборка отправлена",
      description: `Подборка отправлена клиенту на email: ${collection.clientEmail}`,
    })
  }

  const shareViaEmail = () => {
    const url = `${window.location.origin}/collection/${id}`
    const subject = encodeURIComponent(`Подборка недвижимости: ${collection.title}`)
    const body = encodeURIComponent(
      `Здравствуйте!\n\nПросмотрите подборку недвижимости по ссылке: ${url}\n\nС уважением,\n${collection.agent?.name || "Ваш риелтор"}`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`

    toast({
      title: "Email-клиент открыт",
      description: "Подготовлено письмо для отправки подборки",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к подборкам
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{collection.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={collection.status === "active" ? "default" : "secondary"}>
              {collection.status === "active" ? "Активна" : "Истекла"}
            </Badge>
            <span className="text-sm text-muted-foreground">Создана: {collection.createdAt}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <QrCode className="h-4 w-4" />
                QR-код
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR-код подборки</DialogTitle>
                <DialogDescription>Отсканируйте QR-код для быстрого доступа к подборке</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/placeholder.svg" alt="QR-код" width={200} height={200} className="h-48 w-48" />
                </div>
                <Button onClick={copyCollectionLink} variant="outline" className="mt-4 gap-2">
                  <Copy className="h-4 w-4" />
                  Копировать ссылку
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="gap-2" onClick={copyCollectionLink}>
            <Share2 className="h-4 w-4" />
            Копировать ссылку
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={shareViaEmail}>
            <Mail className="h-4 w-4" />
            Отправить по email
          </Button>

          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href={`/collections/${id}/edit`}>
              <Edit className="h-4 w-4" />
              Редактировать
            </Link>
          </Button>

          <Button size="sm" className="gap-2" onClick={sendCollectionToClient}>
            <Send className="h-4 w-4" />
            Отправить клиенту
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Клиент</span>
              <span className="font-medium">{collection.clientName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Телефон</span>
              <span className="font-medium">{collection.clientPhone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{collection.clientEmail}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Действует до</span>
              <span className="font-medium">{collection.expiresAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          <TabsTrigger value="stats">Статистика</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <CollectionPreview collection={collection} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Всего просмотров</span>
                  <span className="text-2xl font-bold">{collection.viewCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Последний просмотр</span>
                  <span className="font-medium">{collection.lastViewed}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Объектов в подборке</span>
                  <span className="font-medium">{collection.propertyIds.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Переходов на объекты</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-muted-foreground">
            Здесь будет отображаться подробная статистика по просмотрам подборки
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
