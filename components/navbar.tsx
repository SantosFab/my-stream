"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Input, Button } from "@/components/ui"
import { TmdbAuthButton } from "@/components/tmdb-auth-button"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Search01Icon,
  Tv01Icon,
  Film01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const links: { href: string; label: string; icon: IconSvgElement }[] = [
    { href: "/", label: "Home", icon: Home01Icon },
    { href: "/movies", label: "Movies", icon: Film01Icon },
    { href: "/tv", label: "TV Shows", icon: Tv01Icon },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="mr-2 flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tracking-tight text-primary">
            CineStream
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex items-center gap-2 w-full max-w-sm">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies & shows..."
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button type="submit" size="sm" variant="default" className="shrink-0">
            Search
          </Button>
        </form>

        <TmdbAuthButton />

        <nav className="flex md:hidden items-center gap-1 ml-2">
          {links.map(({ href, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                pathname === href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-5" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
