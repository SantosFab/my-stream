"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { Genre } from "@/lib/types"

type Category = { value: string; label: string }

type FilterBarProps = {
  categories: Category[]
  genres: Genre[]
}

export function FilterBar({ categories, genres }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? categories[0]!.value
  const genreId = searchParams.get("genre") ?? ""

  function buildUrl(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    params.delete("page")
    return `?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs
        value={category}
        onValueChange={(v) => router.push(buildUrl({ category: v as string }))}
      >
        <TabsList>
          {categories.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select
        value={genreId || "all"}
        onValueChange={(v) =>
          router.push(buildUrl({ genre: v === "all" ? null : String(v) }))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((g) => (
            <SelectItem key={g.id} value={String(g.id)}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
