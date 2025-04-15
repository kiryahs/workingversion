"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    address: string
    photos: string[]
    area: number
    floor: number
    totalFloors: number
    renovation: string
    createdAt: string
    views: number
  }
}

export function PropertyCard({ property }: { property: PropertyCardProps["property"] }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm("Удалить объект?")
    if (!confirmed) return

    await fetch(`/api/delete-property?id=${property.id}`, {
      method: "DELETE",
    })

    router.refresh()
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <Image
          src={property.photos[0]}
          alt={property.title}
          width={400}
          height={300}
          className="rounded-md mb-4"
        />
        <h3 className="text-xl font-bold">{property.title}</h3>
        <p className="text-sm text-gray-600">{property.address}</p>
        <p className="text-sm mt-2">{property.description}</p>
        <p className="text-lg font-semibold mt-2">${property.price}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/edit-property/${property.id}`}>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" /> Редактировать
          </Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" /> Удалить
        </Button>
      </CardFooter>
    </Card>
  )
}
