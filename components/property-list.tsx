"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

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
    createdAt: "2023-10-15",
    views: 245,
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
    createdAt: "2023-11-02",
    views: 187,
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
    createdAt: "2023-09-28",
    views: 312,
  },
]

// Обновим функцию PropertyList, чтобы она загружала данные из localStorage
export function PropertyList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState(mockProperties)

  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const loadProperties = () => {
      try {
        const storedProperties = localStorage.getItem("properties")
        if (storedProperties) {
          setProperties(JSON.parse(storedProperties))
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных из localStorage:", error)
      }
    }

    loadProperties()
  }, [])

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по названию или адресу..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        <Button variant="outline">Сортировка</Button>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Объекты не найдены</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Попробуйте изменить параметры поиска или добавьте новый объект.
            </p>
            <Button asChild>
              <a href="/add-property">Добавить объект</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
