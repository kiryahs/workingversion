"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, FolderPlus, Share2, Edit, Trash2, Eye, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// Пример данных подборок
const mockCollections = [
  {
    id: "1",
    title: "Квартиры для семьи Ивановых",
    description: "3-комнатные квартиры в центре города с хорошей инфраструктурой",
    propertyCount: 5,
    clientName: "Семья Ивановых",
    createdAt: "2023-11-15",
    lastViewed: "2023-11-20",
    viewCount: 8,
    status: "active",
  },
  {
    id: "2",
    title: "Коммерческая недвижимость для ООО 'Старт'",
    description: "Офисные помещения от 50 до 100 м² в бизнес-центрах класса B",
    propertyCount: 3,
    clientName: "ООО 'Старт'",
    createdAt: "2023-11-10",
    lastViewed: "2023-11-18",
    viewCount: 12,
    status: "active",
  },
  {
    id: "3",
    title: "Загородные дома для Петровых",
    description: "Дома в пригороде с участком от 10 соток",
    propertyCount: 4,
    clientName: "Семья Петровых",
    createdAt: "2023-10-28",
    lastViewed: "2023-11-05",
    viewCount: 6,
    status: "expired",
  },
]

export function CollectionsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [collections, setCollections] = useState(mockCollections)

  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const copyCollectionLink = (id: string) => {
    const url = `${window.location.origin}/collection/${id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на подборку скопирована в буфер обмена",
    })
  }

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((collection) => collection.id !== id))
    toast({
      title: "Подборка удалена",
      description: "Подборка была успешно удалена",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по названию или имени клиента..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        <Button asChild>
          <Link href="/create-collection">
            <FolderPlus className="mr-2 h-4 w-4" />
            Создать подборку
          </Link>
        </Button>
      </div>

      {filteredCollections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="line-clamp-1">{collection.title}</CardTitle>
                  <Badge variant={collection.status === "active" ? "default" : "secondary"}>
                    {collection.status === "active" ? "Активна" : "Истекла"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{collection.description}</p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Клиент:</span>
                    <span className="font-medium">{collection.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Объектов:</span>
                    <span className="font-medium">{collection.propertyCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Просмотров:</span>
                    <span className="font-medium">{collection.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Последний просмотр:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {collection.lastViewed}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/collections/${collection.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Просмотр
                  </Link>
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex items-center"
                    onClick={() => copyCollectionLink(collection.id)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">Поделиться</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/collections/${collection.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Редактировать</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteCollection(collection.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Удалить</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <FolderPlus className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="mt-4 text-lg font-semibold">Подборки не найдены</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Создайте свою первую подборку недвижимости для клиента.
            </p>
            <Button asChild>
              <Link href="/create-collection">Создать подборку</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
