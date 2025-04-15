"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MapPin, Ruler, Building, Paintbrush, Phone, MessageSquare, Heart, Send, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Пример данных подборки
const mockCollection = {
  id: "1",
  title: "Квартиры для семьи Ивановых",
  description: "3-комнатные квартиры в центре города с хорошей инфраструктурой",
  createdAt: "2023-11-15",
  agent: {
    name: "Иван Петров",
    phone: "+7 (999) 123-45-67",
    telegram: "@ivanpetrov",
    photo: "/placeholder-user.jpg",
  },
  properties: [
    {
      id: "1",
      title: "3-комнатная квартира, 78 м²",
      description:
        "Просторная квартира с отличным ремонтом в центре города. Большая кухня-гостиная, две спальни, два санузла. Панорамные окна с видом на город. В квартире выполнен дизайнерский ремонт с использованием качественных материалов. Закрытая территория, подземный паркинг, консьерж.",
      price: 12500000,
      address: "ул. Ленина, 45",
      photos: Array(6).fill("/placeholder.svg"),
      area: 78,
      floor: 5,
      totalFloors: 9,
      renovation: "Евроремонт",
    },
    {
      id: "2",
      title: "2-комнатная квартира, 54 м²",
      description:
        "Уютная квартира с балконом и видом на парк. Качественный ремонт, встроенная кухня, шкафы-купе. Развитая инфраструктура района, рядом школа, детский сад, магазины.",
      price: 8700000,
      address: "ул. Пушкина, 12",
      photos: Array(4).fill("/placeholder.svg"),
      area: 54,
      floor: 3,
      totalFloors: 5,
      renovation: "Косметический",
    },
    {
      id: "3",
      title: "Дом 150 м² на участке 10 сот.",
      description:
        "Загородный дом со всеми коммуникациями, гаражом и баней. Участок ухоженный, с плодовыми деревьями и кустарниками. Хороший подъезд к дому, круглогодичное проживание.",
      price: 18500000,
      address: "пос. Сосновый Бор, ул. Лесная, 8",
      photos: Array(8).fill("/placeholder.svg"),
      area: 150,
      floor: 2,
      totalFloors: 2,
      renovation: "Дизайнерский",
    },
  ],
}

interface ClientCollectionViewProps {
  id: string
}

export function ClientCollectionView({ id }: ClientCollectionViewProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  // В реальном приложении здесь будет запрос к API для получения данных о подборке по ID
  const collection = mockCollection

  // Имитация отправки события просмотра подборки
  useEffect(() => {
    console.log(`Подборка ${id} просмотрена`)
    // Здесь будет запрос к API для фиксации просмотра
  }, [id])

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => (prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]))
  }

  const shareCollection = (method: "whatsapp" | "telegram" | "copy") => {
    const url = window.location.href
    const text = `Подборка недвижимости: ${collection.title}`

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank")
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("Ссылка скопирована в буфер обмена")
        break
    }
  }

  const filteredProperties =
    activeTab === "favorites"
      ? collection.properties.filter((property) => favorites.includes(property.id))
      : collection.properties

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="font-heading text-xl font-bold">РиелторПро</span>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="font-heading text-3xl font-bold">{collection.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => shareCollection("whatsapp")}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareCollection("telegram")}>
                  <Send className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Telegram</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareCollection("copy")}>
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Копировать</span>
                </Button>
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">{collection.description}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-16 w-16 border-2 border-background">
                  <AvatarImage src={collection.agent.photo || "/placeholder.svg"} alt={collection.agent.name} />
                  <AvatarFallback className="text-lg">
                    {collection.agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold">Ваш риелтор: {collection.agent.name}</h2>
                  <p className="text-sm text-muted-foreground">Подборка создана: {collection.createdAt}</p>
                </div>

                <div className="flex gap-2 sm:ml-auto">
                  <Button className="gap-2">
                    <Phone className="h-4 w-4" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Написать
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">Все объекты ({collection.properties.length})</TabsTrigger>
                <TabsTrigger value="favorites">Избранное ({favorites.length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6">
              {renderProperties(filteredProperties, favorites, toggleFavorite)}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              {favorites.length > 0 ? (
                renderProperties(filteredProperties, favorites, toggleFavorite)
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Heart className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="mt-4 text-lg font-semibold">Нет избранных объектов</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Добавьте понравившиеся объекты в избранное, нажав на значок сердечка.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
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

function renderProperties(
  properties: typeof mockCollection.properties,
  favorites: string[],
  toggleFavorite: (id: string) => void,
) {
  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid sm:grid-cols-[300px_1fr] gap-4">
              <div className="relative h-48 sm:h-auto">
                <Image
                  src={property.photos[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
                    favorites.includes(property.id) ? "text-red-500" : "text-white"
                  }`}
                  onClick={() => toggleFavorite(property.id)}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? "fill-red-500" : ""}`} />
                  <span className="sr-only">Добавить в избранное</span>
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{property.description}</p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-blue-600" />
                    <span>{property.area} м²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>
                      {property.floor}/{property.totalFloors} эт.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4 text-blue-600" />
                    <span>{property.renovation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat("ru-RU").format(property.price)} ₽
                  </div>
                  <Button asChild>
                    <Link href={`/property/${property.id}`}>Подробнее</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
