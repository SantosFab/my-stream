import { NextResponse } from "next/server"
import { getTVSeason } from "@/lib/tmdb"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season } = await params
  try {
    const data = await getTVSeason(Number(id), Number(season))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
