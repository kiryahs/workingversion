"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, MessageSquare, Instagram, Facebook } from "lucide-react"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  phone: z.string().min(10, {
    message: "Введите корректный номер телефона",
  }),
  telegram: z.string().optional(),
  experience: z.string().optional(),
  vk: z.string().optional(),
  whatsapp: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function UserProfile() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Иван Петров",
      phone: "+7 (999) 123-45-67",
      telegram: "@ivanpetrov",
      experience: "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
      vk: "ivanpetrov",
      whatsapp: "+79991234567",
    },
  })

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    // Имитация отправки данных на сервер
    setTimeout(() => {
      console.log(data)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src="/placeholder-user.jpg" alt="Аватар" />
            <AvatarFallback className="text-lg">ИП</AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
            <span className="sr-only">Изменить аватар</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </Button>
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">Иван Петров</h2>
          <p className="text-muted-foreground">Риелтор</p>
          <div className="flex justify-center gap-2 sm:justify-start">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <Phone className="h-4 w-4" />
              <span className="sr-only">Телефон</span>
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Сообщение</span>
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
          <CardDescription>
            Обновите информацию о себе, которая будет отображаться на лендингах объектов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя и фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 (999) 123-45-67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание опыта</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Расскажите о своем опыте работы" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ВКонтакте</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="+79991234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
