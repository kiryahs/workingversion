"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter } from "lucide-react"
import Image from "next/image"

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
  {
    id: "4",
    title: "1-комнатная квартира, 42 м²",
    description: "Светлая квартира с современным ремонтом",
    price: 6200000,
    address: "ул. Гагарина, 23",
    photos: ["/placeholder.svg"],
    area: 42,
    floor: 7,
    totalFloors: 12,
    renovation: "Евроремонт",
  },
  {
    id: "5",
    title: "Офисное помещение, 85 м²",
    description: "Офис в бизнес-центре класса B с отдельным входом",
    price: 14500000,
    address: "ул. Профсоюзная, 56",
    photos: ["/placeholder.svg"],
    area: 85,
    floor: 3,
    totalFloors: 8,
    renovation: "Офисный",
  },
]

interface PropertySelectorProps {
  onSelectionChange: (selectedIds: string[]) => void
}

export function PropertySelector({ onSelectionChange }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredProperties = mockProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCheckboxChange = (propertyId: string, checked: boolean) => {
    let newSelectedIds: string[]

    if (checked) {
      newSelectedIds = [...selectedIds, propertyId]
    } else {
      newSelectedIds = selectedIds.filter((id) => id !== propertyId)
    }

    setSelectedIds(newSelectedIds)
    onSelectionChange(newSelectedIds)
  }

  const handleSelectAll = () => {
    const allIds = filteredProperties.map((property) => property.id)
    setSelectedIds(allIds)
    onSelectionChange(allIds)
  }

  const handleDeselectAll = () => {
    setSelectedIds([])
    onSelectionChange([])
  }

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
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Выбрано объектов: <span className="font-medium">{selectedIds.length}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Выбрать все
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll}>
            Снять выбор
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <div key={property.id} className="flex items-center gap-4 border rounded-lg p-4">
            <Checkbox
              id={`property-${property.id}`}
              checked={selectedIds.includes(property.id)}
              onCheckedChange={(checked) => handleCheckboxChange(property.id, checked === true)}
            />
            <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
              <Image
                src={property.photos[0] || "/placeholder.svg"}
                alt={property.title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`property-${property.id}`} className="font-medium cursor-pointer">
                {property.title}
              </label>
              <p className="text-sm text-muted-foreground">{property.address}</p>
              <div className="flex gap-4 mt-1 text-sm">
                <span>{property.area} м²</span>
                <span>
                  {property.floor}/{property.totalFloors} эт.
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {new Intl.NumberFormat("ru-RU").format(property.price)} ₽
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
