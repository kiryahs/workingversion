"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Share2, Edit, Trash2, QrCode, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    address: string
    photos: string[]
    area: number
    floor: number
    totalFloors: number
    renovation: string
    createdAt: string
    views: number
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [showActions, setShowActions] = useState(false)

  const formattedPrice = new Intl.NumberFormat("ru-RU").format(property.price)
  const propertyUrl = `/property/${property.id}-${property.title.toLowerCase().replace(/\s+/g, "-")}`

  const copyLink = () => {
    const url = `${window.location.origin}${propertyUrl}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на объект скопирована в буфер обмена",
    })
  }

  const handleDelete = () => {
    // В реальном приложении здесь будет запрос к API для удаления объекта
    console.log("Удаление объекта:", property.id)

    toast({
      title: "Объект удален",
      description: "Объект недвижимости был успешно удален",
    })

    // В реальном приложении здесь можно обновить список объектов
    // или перезагрузить страницу
  }

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative">
        <Link href={propertyUrl}>
          <Image
            src={property.photos[0] || "/placeholder.svg"}
            alt={property.title}
            width={400}
            height={225}
            className="h-48 w-full object-cover"
          />
        </Link>

        {showActions && (
          <div className="absolute right-2 top-2 flex gap-1">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" asChild>
              <Link href={`/edit-property/${property.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Редактировать</span>
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удаление объекта</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить этот объект недвижимости? Это действие нельзя отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={propertyUrl} className="hover:underline">
            <h3 className="font-heading font-semibold">{property.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{property.address}</p>
          <p className="text-2xl font-semibold text-blue-600">{formattedPrice} ₽</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>{property.area} м²</div>
            <div>
              {property.floor}/{property.totalFloors} эт.
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{property.views}</span>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <QrCode className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:inline">QR-код</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR-код объекта</DialogTitle>
                <DialogDescription>Отсканируйте QR-код для быстрого доступа к странице объекта</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white p-2 rounded-lg">
                  <Image src="/placeholder.svg" alt="QR-код" width={200} height={200} className="h-48 w-48" />
                </div>
                <Button onClick={copyLink} variant="outline" className="mt-4 gap-2">
                  <Copy className="h-4 w-4" />
                  Копировать ссылку
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={copyLink}>
            <Share2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline">Поделиться</span>
          </Button>

          <Button size="sm" variant="default" className="h-8" asChild>
            <Link href={propertyUrl}>Просмотр</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
