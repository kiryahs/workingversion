import { PropertyLanding } from "@/components/property-landing"

interface PropertyPageProps {
  params: {
    id: string
  }
}

// Обновим функцию PropertyPage, чтобы она загружала данные из localStorage
export default function PropertyPage({ params }: PropertyPageProps) {
  // Получаем ID объекта из URL
  const propertyId = params.id.split("-")[0]

  // Пытаемся загрузить данные из localStorage
  let property

  if (typeof window !== "undefined") {
    try {
      const storedProperties = localStorage.getItem("properties")
      if (storedProperties) {
        const properties = JSON.parse(storedProperties)
        property = properties.find((p: any) => p.id === propertyId)
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных из localStorage:", error)
    }
  }

  // Если данные не найдены в localStorage, используем моковые данные
  if (!property) {
    property = {
      id: propertyId,
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
      coordinates: { lat: 55.7558, lng: 37.6173 },
      createdAt: "2023-10-15",
      views: 245,
      agent: {
        name: "Иван Петров",
        phone: "+7 (999) 123-45-67",
        telegram: "@ivanpetrov",
        photo: "/placeholder-user.jpg",
        experience:
          "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
      },
    }
  } else {
    // Убедимся, что свойство agent существует и содержит все необходимые поля
    property.agent = property.agent || {
      name: "Иван Петров",
      phone: "+7 (999) 123-45-67",
      telegram: "@ivanpetrov",
      photo: "/placeholder-user.jpg",
      experience: "Более 5 лет опыта работы с недвижимостью в Москве и области. Специализация на элитной недвижимости.",
    }
  }

  return <PropertyLanding property={property} />
}
