"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertySelector } from "@/components/property-selector"
import { CollectionPreview } from "@/components/collection-preview"
import { ArrowLeft, Save, Eye, Share2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

const collectionFormSchema = z.object({
  title: z.string().min(5, {
    message: "Название должно содержать не менее 5 символов",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов",
  }),
  clientName: z.string().min(2, {
    message: "Укажите имя клиента",
  }),
  clientPhone: z.string().optional(),
  clientEmail: z
    .string()
    .email({
      message: "Введите корректный email",
    })
    .optional(),
  expiresAt: z.string().optional(),
})

type CollectionFormValues = z.infer<typeof collectionFormSchema>

export default function CreateCollectionPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [collectionLink, setCollectionLink] = useState<string | null>(null)

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      expiresAt: "",
    },
  })

  function onSubmit(data: CollectionFormValues) {
    if (selectedProperties.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один объект в подборку",
        variant: "destructive",
      })
      return
    }

    // Здесь будет отправка данных на сервер
    console.log({ ...data, properties: selectedProperties })

    // Генерируем ссылку на подборку
    const collectionId = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}/collection/${collectionId}`
    setCollectionLink(link)

    toast({
      title: "Подборка создана",
      description: "Подборка успешно создана и готова к отправке клиенту",
    })
  }

  const handlePropertySelection = (propertyIds: string[]) => {
    setSelectedProperties(propertyIds)
  }

  const copyCollectionLink = () => {
    if (collectionLink) {
      navigator.clipboard.writeText(collectionLink)
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на подборку скопирована в буфер обмена",
      })
    }
  }

  const shareViaWhatsApp = () => {
    if (collectionLink) {
      const text = encodeURIComponent(`Здравствуйте! Просмотрите подборку недвижимости по ссылке: ${collectionLink}`)
      window.open(`https://wa.me/?text=${text}`, "_blank")
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
        <h1 className="font-heading text-3xl font-bold">Создание подборки</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Информация</TabsTrigger>
          <TabsTrigger value="properties">Объекты</TabsTrigger>
          <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>Заполните информацию о подборке и клиенте</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название подборки</FormLabel>
                        <FormControl>
                          <Input placeholder="Например: Квартиры для семьи Ивановых" {...field} />
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
                          <Textarea
                            placeholder="Краткое описание подборки и пожеланий клиента"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя клиента</FormLabel>
                          <FormControl>
                            <Input placeholder="Иван Иванов" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон клиента</FormLabel>
                          <FormControl>
                            <Input placeholder="+7 (999) 123-45-67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email клиента</FormLabel>
                          <FormControl>
                            <Input placeholder="client@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Срок действия подборки</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("properties")}>
                    Далее
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выбор объектов</CardTitle>
                  <CardDescription>Добавьте объекты недвижимости в подборку для клиента</CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertySelector onSelectionChange={handlePropertySelection} />
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
                  <CardTitle>Предпросмотр подборки</CardTitle>
                  <CardDescription>Так будет выглядеть подборка для вашего клиента</CardDescription>
                </CardHeader>
                <CardContent>
                  <CollectionPreview
                    collection={{
                      ...form.getValues(),
                      propertyIds: selectedProperties,
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("properties")}>
                    Назад
                  </Button>
                  <div className="flex gap-2">
                    {collectionLink ? (
                      <>
                        <Button variant="outline" type="button" onClick={copyCollectionLink}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Копировать ссылку
                        </Button>
                        <Button variant="outline" type="button" onClick={shareViaWhatsApp}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Отправить в WhatsApp
                        </Button>
                        <Button variant="outline" type="button" asChild>
                          <Link href="/collections">Перейти к подборкам</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" type="button">
                          <Eye className="mr-2 h-4 w-4" />
                          Полный предпросмотр
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            form.handleSubmit(onSubmit)()
                          }}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Создать подборку
                        </Button>
                      </>
                    )}
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
