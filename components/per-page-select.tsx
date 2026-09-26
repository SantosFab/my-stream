"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

type PerPageSelectProps = {
  value: number
  options: readonly number[]
  defaultValue: number
}

export function PerPageSelect({ value, options, defaultValue }: PerPageSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(next: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (!next || Number(next) === defaultValue) {
      params.delete("per_page")
    } else {
      params.set("per_page", next)
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={String(value)} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue>{value} per page</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={String(o)}>
            {o} per page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
