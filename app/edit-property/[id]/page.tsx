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

// Пример данных объектов недвижимости (в реальном приложении будет API)
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
    renovation: "euro",
    propertyType: "apartment",
    dealType: "sale",
    coordinates: { lat: 55.7558, lng: 37.6173 },
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
    renovation: "cosmetic",
    propertyType: "apartment",
    dealType: "sale",
    coordinates: { lat: 55.7512, lng: 37.6184 },
    createdAt: "2023-11-02",
    views: 187,
  },
]

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

// Добавим функцию для сохранения данных в localStorage
function savePropertyData(propertyData: any) {
  try {
    // Получаем текущие данные из localStorage или используем пустой массив
    const storedProperties = localStorage.getItem("properties")
    const properties = storedProperties ? JSON.parse(storedProperties) : mockProperties

    // Находим индекс объекта, который нужно обновить
    const index = properties.findIndex((p: any) => p.id === propertyData.id)

    if (index !== -1) {
      // Обновляем объект
      properties[index] = {
        ...properties[index],
        ...propertyData,
        photos: propertyData.photos,
        coordinates: propertyData.coordinates,
      }
    } else {
      // Если объект не найден, добавляем его
      properties.push(propertyData)
    }

    // Сохраняем обновленный массив в localStorage
    localStorage.setItem("properties", JSON.stringify(properties))
    return true
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error)
    return false
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [photos, setPhotos] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState({ lat: 55.7558, lng: 37.6173 })
  const [currentAddress, setCurrentAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Находим объект по ID из URL
  const propertyId = params.id

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

  // Изменим функцию загрузки данных объекта, чтобы она проверяла localStorage
  useEffect(() => {
    const loadPropertyData = async () => {
      setIsLoading(true)
      try {
        // Проверяем, есть ли данные в localStorage
        const storedProperties = localStorage.getItem("properties")
        const properties = storedProperties ? JSON.parse(storedProperties) : mockProperties

        // Находим объект по ID
        const property = properties.find((p: any) => p.id === propertyId)

        if (property) {
          // Заполняем форму данными объекта
          form.reset({
            title: property.title,
            description: property.description,
            price: property.price.toString(),
            address: property.address,
            area: property.area.toString(),
            floor: property.floor?.toString() || "",
            totalFloors: property.totalFloors?.toString() || "",
            renovation: property.renovation || "",
            propertyType: property.propertyType,
            dealType: property.dealType,
          })

          // Устанавливаем фотографии и координаты
          setPhotos(property.photos || [])
          setCoordinates(property.coordinates || { lat: 55.7558, lng: 37.6173 })
          setCurrentAddress(property.address)
        } else {
          // Если объект не найден, показываем уведомление и перенаправляем
          toast({
            title: "Ошибка",
            description: "Объект недвижимости не найден",
            variant: "destructive",
          })
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных объекта:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные объекта",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPropertyData()
  }, [propertyId, form])

  // Отслеживаем изменение адреса для обновления карты
  const address = form.watch("address")

  useEffect(() => {
    if (address && address.length > 5 && address !== currentAddress) {
      setCurrentAddress(address)
    }
  }, [address, currentAddress])

  // Обновим обработчик отправки формы
  function onSubmit(data: PropertyFormValues) {
    setIsSubmitting(true)

    // Убедимся, что фотографии включены в данные
    const updatedPropertyData = {
      id: propertyId,
      ...data,
      photos: photos,
      coordinates: coordinates,
      // Добавляем информацию об агенте, чтобы она сохранялась при редактировании
      agent: {
        name: "Иван Петров",
        phone: "+7 (999) 123-45-67",
        telegram: "@ivanpetrov",
        photo: "/placeholder-user.jpg",
        experience:
          "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
      },
    }

    // Сохраняем данные в localStorage
    const success = savePropertyData(updatedPropertyData)

    if (success) {
      // Показываем уведомление об успешном обновлении
      toast({
        title: "Объект обновлен",
        description: "Изменения успешно сохранены",
      })

      // Перенаправляем на дашборд
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
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

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Загрузка данных объекта...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
        <h1 className="font-heading text-3xl font-bold">Редактирование объекта</h1>
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
                  <CardDescription>Обновите данные об объекте недвижимости</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип недвижимости</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
                  <CardDescription>Обновите фотографии объекта недвижимости</CardDescription>
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
                      id: propertyId,
                      photos: photos.length > 0 ? photos : ["/placeholder.svg"],
                      coordinates,
                      createdAt: new Date().toISOString(),
                      views: 0,
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
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
                    {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
