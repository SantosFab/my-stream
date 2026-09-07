"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import type { Video } from "@/lib/types"

function pickTrailer(videos: Video[]): Video | null {
  const yt = videos.filter((v) => v.site === "YouTube" && v.key)
  if (yt.length === 0) return null
  const scored = [...yt].sort((a, b) => {
    const rank = (v: Video) =>
      (v.type === "Trailer" ? 0 : v.type === "Teaser" ? 1 : 2) * 2 +
      (v.official ? 0 : 1)
    return rank(a) - rank(b)
  })
  return scored[0] ?? null
}

export function TrailerDialog({ videos }: { videos: Video[] }) {
  const [open, setOpen] = useState(false)
  const trailer = pickTrailer(videos)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, close])

  if (!trailer) return null

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-4" />
        Watch Trailer
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Trailer: ${trailer.name}`}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close trailer"
              className="absolute right-2 top-2 z-10 rounded-md bg-black/60 p-1.5 text-white hover:bg-black/80"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-4" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function TrailerThumbnail({ videos, title }: { videos: Video[]; title: string }) {
  const trailer = pickTrailer(videos)
  if (!trailer) return null
  return (
    <Image
      src={`https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`}
      alt={`${title} trailer thumbnail`}
      width={320}
      height={180}
      className="rounded-md"
    />
  )
}
