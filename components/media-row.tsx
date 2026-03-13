import Link from "next/link"
import { MediaCard, MediaCardSkeleton } from "@/components/media-card"
import { cn } from "@workspace/ui/lib/utils"
import type { Movie, TVShow, MediaType } from "@/lib/types"

type MediaRowProps = {
  title: string
  items: (Movie | TVShow)[]
  type: MediaType
  viewAllHref?: string
  className?: string
}

export function MediaRow({ title, items, type, viewAllHref, className }: MediaRowProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {items.slice(0, 14).map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  )
}

export function MediaRowSkeleton({ title }: { title: string }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
