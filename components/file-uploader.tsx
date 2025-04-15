"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

// Добавим параметр initialPhotos для загрузки существующих фотографий
interface FileUploaderProps {
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
  initialPhotos?: string[]
}

export function FileUploader({ onPhotosChange, maxPhotos = 10, initialPhotos = [] }: FileUploaderProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos)

  // Инициализируем фотографии при монтировании компонента
  useEffect(() => {
    if (initialPhotos.length > 0) {
      setPhotos(initialPhotos)
      onPhotosChange(initialPhotos)
    }
  }, [initialPhotos, onPhotosChange])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos = acceptedFiles.map((file) => URL.createObjectURL(file))
      const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos)
      setPhotos(updatedPhotos)
      onPhotosChange(updatedPhotos)
    },
    [photos, maxPhotos, onPhotosChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxPhotos - photos.length,
  })

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos]
    updatedPhotos.splice(index, 1)
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-600"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive ? "Перетащите файлы сюда" : "Перетащите файлы или нажмите для выбора"}
          </p>
          <p className="text-sm text-muted-foreground">Поддерживаются JPG, PNG и WebP. Максимум {maxPhotos} фото.</p>
          <Button type="button" variant="outline" className="mt-2">
            Выбрать файлы
          </Button>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <Image src={photo || "/placeholder.svg"} alt={`Фото ${index + 1}`} fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 px-2">
                  Главное фото
                </div>
              )}
            </Card>
          ))}

          {photos.length < maxPhotos && (
            <Card
              className="flex items-center justify-center aspect-square cursor-pointer hover:border-blue-600 transition-colors"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center p-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">Добавить еще фото</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
