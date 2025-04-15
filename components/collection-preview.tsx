"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Folder, MapPin, Ruler, Building, Paintbrush } from "lucide-react"

// Пример данных объектов недвижимости
const mockProperties = [
  {
    id: "1",
    title: "3-комнатная квартира, 78 м²",
    description: "Просторная квартира с отличным ремонтом в центре города",
    price: 12500000,
    address: "ул. Ленина, 45",
    photos: ["/placeholder.svg"],
    area: 78,
    floor: 5,
    totalFloors: 9,
    renovation: "Евроремонт",
  },
  {
    id: "2",
    title: "2-комнатная квартира, 54 м²",
    description: "Уютная квартира с балконом и видом на парк",
    price: 8700000,
    address: "ул. Пушкина, 12",
    photos: ["/placeholder.svg"],
    area: 54,
    floor: 3,
    totalFloors: 5,
    renovation: "Косметический",
  },
  {
    id: "3",
    title: "Дом 150 м² на участке 10 сот.",
    description: "Загородный дом со всеми коммуникациями, гаражом и баней",
    price: 18500000,
    address: "пос. Сосновый Бор, ул. Лесная, 8",
    photos: ["/placeholder.svg"],
    area: 150,
    floor: 2,
    totalFloors: 2,
    renovation: "Дизайнерский",
  },
]

interface CollectionPreviewProps {
  collection: {
    title: string
    description: string
    clientName: string
    clientPhone?: string
    clientEmail?: string
    expiresAt?: string
    propertyIds: string[]
  }
}

export function CollectionPreview({ collection }: CollectionPreviewProps) {
  // Фильтруем объекты по выбранным ID
  const selectedProperties = mockProperties.filter((property) => collection.propertyIds.includes(property.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Folder className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{collection.title}</h2>
      </div>

      <p className="text-muted-foreground">{collection.description}</p>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col p-3 border rounded-lg">
          <span className="text-sm text-muted-foreground">Клиент</span>
          <span className="font-medium">{collection.clientName}</span>
        </div>
        {collection.clientPhone && (
          <div className="flex flex-col p-3 border rounded-lg">
            <span className="text-sm text-muted-foreground">Телефон</span>
            <span className="font-medium">{collection.clientPhone}</span>
          </div>
        )}
        {collection.clientEmail && (
          <div className="flex flex-col p-3 border rounded-lg">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{collection.clientEmail}</span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-4">Объекты в подборке ({selectedProperties.length})</h3>

        {selectedProperties.length > 0 ? (
          <div className="space-y-6">
            {selectedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid sm:grid-cols-[250px_1fr] gap-4">
                    <div className="relative h-48 sm:h-full">
                      <Image
                        src={property.photos[0] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-xl font-semibold">{property.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{property.address}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {property.area} м²
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {property.floor}/{property.totalFloors} эт.
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Paintbrush className="h-3 w-3" />
                          {property.renovation}
                        </Badge>
                      </div>

                      <div className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("ru-RU").format(property.price)} ₽
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">Нет выбранных объектов</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Добавьте объекты недвижимости в подборку на предыдущем шаге.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
