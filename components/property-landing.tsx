"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  MapPin,
  Ruler,
  Building,
  Paintbrush,
  Phone,
  MessageSquare,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  QrCode,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Script from "next/script"

interface PropertyLandingProps {
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
    coordinates: { lat: number; lng: number }
    createdAt: string
    views: number
    agent: {
      name: string
      phone: string
      telegram: string
      photo: string
      experience: string
    }
  }
}

export function PropertyLanding({ property }: PropertyLandingProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(property.price)
  const [isYandexLoaded, setIsYandexLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Убедимся, что свойство agent существует
  const agent = property.agent || {
    name: "Иван Петров",
    phone: "+7 (999) 123-45-67",
    telegram: "@ivanpetrov",
    photo: "/placeholder-user.jpg",
    experience: "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
  }

  useEffect(() => {
    if (isYandexLoaded && mapRef.current) {
      // @ts-ignore - ymaps is loaded via script
      window.ymaps.ready(() => {
        // @ts-ignore - ymaps is loaded via script
        const map = new window.ymaps.Map(mapRef.current, {
          center: [property.coordinates.lat, property.coordinates.lng],
          zoom: 15,
          controls: ["zoomControl"],
        })

        // @ts-ignore - ymaps is loaded via script
        const placemark = new window.ymaps.Placemark([property.coordinates.lat, property.coordinates.lng], {
          hintContent: property.title,
          balloonContent: `
              <div>
                <strong>${property.title}</strong>
                <p>${property.address}</p>
                <p>${formattedPrice} ₽</p>
              </div>
            `,
        })

        map.geoObjects.add(placemark)
      })
    }
  }, [isYandexLoaded, property, formattedPrice])

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % property.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length)
  }

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на объект скопирована в буфер обмена",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU"
        onLoad={() => setIsYandexLoaded(true)}
      />

      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="font-heading text-xl font-bold">РиелторПро</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2" onClick={copyLink}>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Поделиться</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  <span className="hidden sm:inline">QR-код</span>
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

            <Button size="sm">Связаться с риелтором</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-blue-600">
            Главная
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-blue-600">
            Недвижимость
          </Link>
          <span>/</span>
          <span>{property.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-8">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={property.photos[currentPhotoIndex] || "/placeholder.svg"}
                  alt={`Фото ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                />

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  {currentPhotoIndex + 1} / {property.photos.length}
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {property.photos.map((photo, index) => (
                  <button
                    key={index}
                    className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ${
                      index === currentPhotoIndex ? "ring-2 ring-blue-600" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Фото ${index + 1}`}
                      width={96}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-heading text-3xl font-bold">{property.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </div>
              <div className="mt-4 text-3xl font-bold text-blue-600">{formattedPrice} ₽</div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Ruler className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Площадь</div>
                    <div className="text-lg font-semibold">{property.area} м²</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Этаж</div>
                    <div className="text-lg font-semibold">
                      {property.floor}/{property.totalFloors}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Paintbrush className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Ремонт</div>
                    <div className="text-lg font-semibold">{property.renovation}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="prose max-w-none">
              <h2>Описание</h2>
              <p>{property.description}</p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Расположение</h2>
              <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden border" style={{ width: "100%" }}>
                {!isYandexLoaded && (
                  <div className="h-full flex items-center justify-center bg-muted">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MapPin className="h-8 w-8" />
                      <p>Загрузка карты...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-background mb-4">
                    <AvatarImage src={agent.photo || "/placeholder.svg"} alt={agent.name} />
                    <AvatarFallback className="text-lg">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Риелтор</p>

                  <p className="text-sm mb-6">{agent.experience}</p>

                  <div className="grid w-full gap-2">
                    <Button className="gap-2">
                      <Phone className="h-4 w-4" />
                      Позвонить
                    </Button>

                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Написать в Telegram
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="font-heading font-bold">РиелторПро</span>
            </div>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} РиелторПро. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
