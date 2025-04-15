"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, MapPin, Ruler, Building, Paintbrush, Phone, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

interface PropertyPreviewProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    address: string
    photos: string[]
    area: number
    floor?: number
    totalFloors?: number
    renovation?: string
    coordinates: { lat: number; lng: number }
    createdAt: string
    views: number
  }
}

export function PropertyPreview({ property }: PropertyPreviewProps) {
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(property.price)
  const [isYandexLoaded, setIsYandexLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="space-y-6">
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU"
        onLoad={() => setIsYandexLoaded(true)}
      />

      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={property.photos[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
          {property.photos.slice(1, 5).map((photo, index) => (
            <div key={index} className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 border-white">
              <Image
                src={photo || "/placeholder.svg"}
                alt={`Фото ${index + 2}`}
                width={96}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {property.photos.length > 5 && (
            <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 border-white">
              <Image
                src={property.photos[5] || "/placeholder.svg"}
                alt={`Фото 6`}
                width={96}
                height={64}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                +{property.photos.length - 5}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <span>Главная</span>
          <span>/</span>
          <span>Недвижимость</span>
          <span>/</span>
          <span>{property.title}</span>
        </div>

        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">{property.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.address}</span>
          </div>
        </div>

        <div className="text-3xl font-bold text-blue-600">{formattedPrice} ₽</div>

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

          {property.floor && (
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
          )}

          {property.renovation && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Paintbrush className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Ремонт</div>
                  <div className="text-lg font-semibold">{property.renovation}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="prose max-w-none">
          <h2>Описание</h2>
          <p>{property.description}</p>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Расположение</h2>
          <div ref={mapRef} className="h-[300px] rounded-lg overflow-hidden border" style={{ width: "100%" }}>
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

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage src="/placeholder-user.jpg" alt="Аватар" />
                <AvatarFallback className="text-lg">ИП</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">Иван Петров</div>
                <div className="text-sm text-muted-foreground">Риелтор</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="gap-2">
                <Phone className="h-4 w-4" />
                Позвонить
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Написать
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
