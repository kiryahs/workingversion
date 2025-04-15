import { CollectionDetail } from "@/components/collection-detail"

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  // В реальном приложении здесь будет запрос к API или базе данных
  // для получения данных о подборке по ID

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Подборка недвижимости</h1>
      </div>

      <CollectionDetail id={params.id} />
    </div>
  )
}
