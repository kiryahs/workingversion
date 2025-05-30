"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { MapPicker } from "@/components/map-picker"
import { PropertyPreview } from "@/components/property-preview"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

const propertyFormSchema = z.object({
  title: z.string().min(5, {
    message: "Название должно содержать не менее 5 символов",
  }),
  description: z.string().min(20, {
    message: "Описание должно содержать не менее 20 символов",
  }),
  price: z
    .string()
    .refine((val) => val.trim() !== "", {
      message: "Укажите цену",
    })
    .transform((val) => Number(val)),
  address: z.string().min(5, {
    message: "Укажите адрес",
  }),
  area: z
    .string()
    .refine((val) => val.trim() !== "", {
      message: "Укажите площадь",
    })
    .transform((val) => Number(val)),
  floor: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  totalFloors: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  renovation: z.string().optional(),
  propertyType: z.string(),
  dealType: z.string(),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

// Mock data for initial properties
const mockProperties = [
  {
    id: "1",
    title: "Квартира в центре",
    description: "Уютная квартира в самом сердце города",
    price: 15000000,
    address: "ул. Центральная, 1",
    area: 60,
    floor: 5,
    totalFloors: 12,
    renovation: "евроремонт",
    propertyType: "apartment",
    dealType: "sale",
    photos: ["/apartment1.jpg", "/apartment2.jpg"],
    coordinates: { lat: 55.7558, lng: 37.6173 },
    createdAt: new Date().toISOString(),
    views: 120,
  },
  {
    id: "2",
    title: "Дом за городом",
    description: "Просторный дом для большой семьи",
    price: 30000000,
    address: "пос. Заречье, ул. Лесная, 10",
    area: 200,
    floor: 2,
    totalFloors: 2,
    renovation: "дизайнерский",
    propertyType: "house",
    dealType: "sale",
    photos: ["/house1.jpg", "/house2.jpg"],
    coordinates: { lat: 55.7558, lng: 37.6173 },
    createdAt: new Date().toISOString(),
    views: 85,
  },
]

export default function AddPropertyPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [photos, setPhotos] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState({ lat: 55.7558, lng: 37.6173 })
  const [currentAddress, setCurrentAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      address: "",
      area: "",
      floor: "",
      totalFloors: "",
      renovation: "",
      propertyType: "apartment",
      dealType: "sale",
    },
  })

  // Отслеживаем изменение адреса для обновления карты
  const address = form.watch("address")

  useEffect(() => {
    if (address && address.length > 5 && address !== currentAddress) {
      setCurrentAddress(address)
    }
  }, [address, currentAddress])

  // Обновим функцию onSubmit, чтобы она сохраняла данные в localStorage
  function onSubmit(data: PropertyFormValues) {
    setIsSubmitting(true)

    // Генерируем уникальный ID для нового объекта
    const newId = Date.now().toString()

    // Создаем объект с данными
    const newPropertyData = {
      id: newId,
      ...data,
      photos: photos,
      coordinates: coordinates,
      createdAt: new Date().toISOString(),
      views: 0,
      // Добавляем информацию об агенте
      agent: {
        name: "Иван Петров",
        phone: "+7 (999) 123-45-67",
        telegram: "@ivanpetrov",
        photo: "/placeholder-user.jpg",
        experience:
          "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
      },
    }

    try {
      // Получаем текущие данные из localStorage или используем пустой массив
      const storedProperties = localStorage.getItem("properties")
      const properties = storedProperties ? JSON.parse(storedProperties) : mockProperties

      // Добавляем новый объект
      properties.push(newPropertyData)

      // Сохраняем обновленный массив в localStorage
      localStorage.setItem("properties", JSON.stringify(properties))

      // Показываем уведомление об успешной публикации
      toast({
        title: "Объект опубликован",
        description: "Объект недвижимости успешно добавлен в вашу базу",
      })

      // Перенаправляем на дашборд
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить объект",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handlePhotosChange = (newPhotos: string[]) => {
    setPhotos(newPhotos)
  }

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng })
  }

  const formValues = form.watch()

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
        <h1 className="font-heading text-3xl font-bold">Добавление объекта</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Детали объекта</TabsTrigger>
          <TabsTrigger value="media">Фото и карта</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>Заполните основные данные об объекте недвижимости</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип недвижимости</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип недвижимости" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Квартира</SelectItem>
                              <SelectItem value="house">Дом</SelectItem>
                              <SelectItem value="commercial">Коммерческая недвижимость</SelectItem>
                              <SelectItem value="land">Земельный участок</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dealType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип сделки</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип сделки" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">Продажа</SelectItem>
                              <SelectItem value="rent">Аренда</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название объекта</FormLabel>
                        <FormControl>
                          <Input placeholder="Например: 3-комнатная квартира, 78 м²" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Подробное описание объекта" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Цена (₽)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Площадь (м²)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Адрес</FormLabel>
                        <FormControl>
                          <Input placeholder="Полный адрес объекта" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Этаж</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalFloors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Этажей всего</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="renovation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ремонт</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип ремонта" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cosmetic">Косметический</SelectItem>
                              <SelectItem value="euro">Евроремонт</SelectItem>
                              <SelectItem value="design">Дизайнерский</SelectItem>
                              <SelectItem value="none">Без ремонта</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("media")}>
                    Далее
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Фотографии объекта</CardTitle>
                  <CardDescription>Загрузите до 10 фотографий объекта недвижимости</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader onPhotosChange={handlePhotosChange} maxPhotos={10} initialPhotos={photos} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Расположение на карте</CardTitle>
                  <CardDescription>Укажите точное расположение объекта на карте</CardDescription>
                </CardHeader>
                <CardContent>
                  <MapPicker
                    initialLat={coordinates.lat}
                    initialLng={coordinates.lng}
                    onCoordinatesChange={handleCoordinatesChange}
                    address={currentAddress}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                    Назад
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setActiveTab("preview")}>
                    Предпросмотр
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Предпросмотр лендинга</CardTitle>
                  <CardDescription>Так будет выглядеть лендинг вашего объекта</CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyPreview
                    property={{
                      ...formValues,
                      id: "preview",
                      photos: photos.length > 0 ? photos : ["/placeholder.svg"],
                      coordinates,
                      createdAt: new Date().toISOString(),
                      views: 0,
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("media")}>
                    Назад
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" type="button">
                      <Eye className="mr-2 h-4 w-4" />
                      Полный предпросмотр
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        form.handleSubmit(onSubmit)()
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Публикация..." : "Опубликовать"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
