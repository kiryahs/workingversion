import { CollectionsList } from "@/components/collections-list"

export default function CollectionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Подборки недвижимости</h1>
      </div>

      <CollectionsList />
    </div>
  )
}
