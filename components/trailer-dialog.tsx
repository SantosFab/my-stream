"use client"

import { useState } from "react"
import Image from "next/image"
import { Button, Dialog, DialogPopup, DialogTitle } from "@/components/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon } from "@hugeicons/core-free-icons"
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

  if (!trailer) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-4" />
        Watch Trailer
      </Button>

      <DialogPopup className="max-w-4xl gap-0 overflow-hidden bg-black p-0">
        <DialogTitle className="sr-only">
          Trailer: {trailer.name}
        </DialogTitle>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </DialogPopup>
    </Dialog>
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
