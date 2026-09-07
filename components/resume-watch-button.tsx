"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { buttonVariants } from "@/components/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon } from "@hugeicons/core-free-icons"
import { getResumeFor } from "@/lib/watch-history"
import { cn } from "@/lib/utils"

type ResumeWatchButtonProps = {
  type: "movie" | "tv"
  id: number
  defaultHref: string
  defaultLabel?: string
}

export function ResumeWatchButton({
  type,
  id,
  defaultHref,
  defaultLabel = "Watch Now",
}: ResumeWatchButtonProps) {
  const [href, setHref] = useState(defaultHref)
  const [label, setLabel] = useState(defaultLabel)
  const [resumeMeta, setResumeMeta] = useState<string | null>(null)

  useEffect(() => {
    const saved = getResumeFor(type, id)
    if (!saved) {
      setHref(defaultHref)
      setLabel(defaultLabel)
      setResumeMeta(null)
      return
    }
    if (saved.type === "movie") {
      setHref(`/watch/movie/${saved.id}`)
      setLabel("Continue watching")
      setResumeMeta(null)
    } else {
      setHref(`/watch/tv/${saved.id}?season=${saved.season}&episode=${saved.episode}`)
      setLabel(`Continue S${saved.season} E${saved.episode}`)
      setResumeMeta(saved.episodeName ?? null)
    }
  }, [type, id, defaultHref, defaultLabel])

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div>
        <Link href={href} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-4" />
          {label}
        </Link>
      </div>
      {resumeMeta && (
        <p className="text-xs text-muted-foreground">You left off at: {resumeMeta}</p>
      )}
    </div>
  )
}
