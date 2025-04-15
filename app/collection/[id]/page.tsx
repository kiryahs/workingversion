import { ClientCollectionView } from "@/components/client-collection-view"

interface ClientCollectionPageProps {
  params: {
    id: string
  }
}

export default function ClientCollectionPage({ params }: ClientCollectionPageProps) {
  // В реальном приложении здесь будет запрос к API или базе данных
  // для получения данных о подборке по ID

  return <ClientCollectionView id={params.id} />
}
