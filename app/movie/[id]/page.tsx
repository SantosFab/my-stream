import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMovieDetails, getMovieCredits, getSimilarMovies, getImageUrl } from "@/lib/tmdb"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { buttonVariants } from "@workspace/ui/components/button-variants"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon, StarIcon, Clock01Icon, Calendar01Icon } from "@hugeicons/core-free-icons"
import { MediaRow } from "@/components/media-row"
import { cn } from "@workspace/ui/lib/utils"

type MoviePageProps = {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieId = Number(id)
  if (isNaN(movieId)) notFound()

  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(movieId).catch(() => null),
    getMovieCredits(movieId).catch(() => ({ cast: [] })),
    getSimilarMovies(movieId).catch(() => ({ results: [] })),
  ])

  if (!movie) notFound()

  const backdropUrl = getImageUrl(movie.backdrop_path, "original")
  const posterUrl = getImageUrl(movie.poster_path, "w342")
  const topCast = credits.cast.slice(0, 8)

  return (
    <main>
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-72 w-full overflow-hidden">
          <Image src={backdropUrl} alt={movie.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6 flex-col sm:flex-row">
          {/* Poster */}
          {posterUrl && (
            <div className="relative w-36 shrink-0 overflow-hidden rounded-lg border border-border/50 shadow-md self-start -mt-20 sm:-mt-28">
              <Image
                src={posterUrl}
                alt={movie.title}
                width={144}
                height={216}
                className="w-full"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <Badge key={g.id} variant="secondary">{g.name}</Badge>
              ))}
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic">{movie.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={StarIcon} className="size-4 text-yellow-500" strokeWidth={1.5} />
                <span className="font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
                <span>({movie.vote_count.toLocaleString()})</span>
              </div>
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Calendar01Icon} className="size-4" strokeWidth={1.5} />
                  {new Date(movie.release_date).getFullYear()}
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={1.5} />
                  {movie.runtime} min
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">{movie.overview}</p>
            <div className="mt-2">
              <Link
                href={`/watch/movie/${movie.id}`}
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                <HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} className="size-4" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>

        {topCast.length > 0 && (
          <>
            <Separator className="my-8" />
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Cast</h2>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {topCast.map((person) => {
                  const profileUrl = getImageUrl(person.profile_path, "w185")
                  return (
                    <div key={person.id} className="flex flex-col gap-1 items-center text-center">
                      <div className="relative size-16 overflow-hidden rounded-full bg-muted">
                        {profileUrl && (
                          <Image src={profileUrl} alt={person.name} fill sizes="64px" className="object-cover" />
                        )}
                      </div>
                      <p className="text-xs font-medium line-clamp-1">{person.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {similar.results.length > 0 && (
          <>
            <Separator className="my-8" />
            <MediaRow title="Similar Movies" items={similar.results} type="movie" />
          </>
        )}
      </div>
    </main>
  )
}
