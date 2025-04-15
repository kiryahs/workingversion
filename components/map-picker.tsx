"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"
import Script from "next/script"

interface MapPickerProps {
  initialLat: number
  initialLng: number
  onCoordinatesChange: (lat: number, lng: number) => void
  address?: string
}

// Declare ymaps as a global variable
declare global {
  interface Window {
    ymaps: any
  }
}

export function MapPicker({ initialLat, initialLng, onCoordinatesChange, address }: MapPickerProps) {
  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng })
  const [markerPosition, setMarkerPosition] = useState({ lat: initialLat, lng: initialLng })
  const [searchQuery, setSearchQuery] = useState(address || "")
  const [isYandexLoaded, setIsYandexLoaded] = useState(false)
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const yandexMapRef = useRef<ymaps.Map | null>(null)
  const placemarkerRef = useRef<ymaps.Placemark | null>(null)

  // Инициализация карты после загрузки API
  useEffect(() => {
    if (isYandexLoaded && mapRef.current && !isMapInitialized) {
      // @ts-ignore - ymaps is loaded via script
      window.ymaps.ready(() => {
        // @ts-ignore - ymaps is loaded via script
        const map = new window.ymaps.Map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: 15,
          controls: ["zoomControl", "geolocationControl"],
        })

        // @ts-ignore - ymaps is loaded via script
        const placemark = new window.ymaps.Placemark(
          [markerPosition.lat, markerPosition.lng],
          {},
          {
            draggable: true,
          },
        )

        placemark.events.add("dragend", () => {
          const newCoords = placemark.geometry.getCoordinates()
          const newPosition = {
            lat: newCoords[0],
            lng: newCoords[1],
          }
          setMarkerPosition(newPosition)
          onCoordinatesChange(newPosition.lat, newPosition.lng)
        })

        map.events.add("click", (e) => {
          const coords = e.get("coords")
          const newPosition = {
            lat: coords[0],
            lng: coords[1],
          }
          placemark.geometry.setCoordinates(coords)
          setMarkerPosition(newPosition)
          onCoordinatesChange(newPosition.lat, newPosition.lng)
        })

        map.geoObjects.add(placemark)

        yandexMapRef.current = map
        placemarkerRef.current = placemark
        setIsMapInitialized(true)
      })
    }
  }, [isYandexLoaded, center, markerPosition, onCoordinatesChange, isMapInitialized])

  // Обработка изменения адреса из родительского компонента
  useEffect(() => {
    if (address && address !== searchQuery) {
      setSearchQuery(address)
      if (isMapInitialized) {
        handleSearch()
      }
    }
  }, [address, isMapInitialized])

  const handleSearch = () => {
    if (isYandexLoaded && searchQuery) {
      // @ts-ignore - ymaps is loaded via script
      window.ymaps.geocode(searchQuery).then((res) => {
        const firstGeoObject = res.geoObjects.get(0)

        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates()
          const newPosition = {
            lat: coords[0],
            lng: coords[1],
          }

          setCenter(newPosition)
          setMarkerPosition(newPosition)
          onCoordinatesChange(newPosition.lat, newPosition.lng)

          if (yandexMapRef.current && placemarkerRef.current) {
            yandexMapRef.current.setCenter(coords, 15)
            placemarkerRef.current.geometry.setCoordinates(coords)
          }
        }
      })
    }
  }

  return (
    <div className="space-y-4">
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU"
        onLoad={() => setIsYandexLoaded(true)}
      />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по адресу..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button type="button" onClick={handleSearch}>
          Найти
        </Button>
      </div>

      <div ref={mapRef} className="h-[400px] rounded-lg border" style={{ width: "100%" }}>
        {!isYandexLoaded && (
          <div className="h-full flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <MapPin className="h-8 w-8" />
              <p>Загрузка карты...</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Координаты: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
      </div>
    </div>
  )
}
