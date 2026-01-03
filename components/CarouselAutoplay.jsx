"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import "swiper/css"
import "swiper/css/pagination"

export function CarouselAutoplay() {
  const [Swiper, setSwiper] = useState(null)
  const [SwiperSlide, setSwiperSlide] = useState(null)
  const [modules, setModules] = useState(null)

  useEffect(() => {
    async function load() {
      const swiperReact = await import("swiper/react")
      const swiperModules = await import("swiper/modules")

      setSwiper(() => swiperReact.Swiper)
      setSwiperSlide(() => swiperReact.SwiperSlide)
      setModules([swiperModules.Autoplay, swiperModules.Pagination])
    }

    load()
  }, [])

  const images = [
    "/Image1.png",
    "/Image2.png",
    "/Image3.png",
  ]

  if (!Swiper || !SwiperSlide || !modules) {
    return <div className="w-full max-w-4xl aspect-[4/3] bg-gray-200 rounded-lg animate-pulse" />
  }

  return (
    <>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
        }
      `}</style>

      <div className="w-full max-w-4xl">
        <Swiper
          modules={modules}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop
          spaceBetween={30}
          slidesPerView={1}
          className="rounded-lg"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
