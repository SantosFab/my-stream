"use client"

import { useEffect } from "react"
import { saveEpisode, saveMovie } from "@/lib/watch-history"

type TrackMovieWatchProps = {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
}

export function TrackMovieWatch({
  id,
  title,
  poster_path,
  backdrop_path,
}: TrackMovieWatchProps) {
  useEffect(() => {
    saveMovie({ id, title, poster_path, backdrop_path })
  }, [id, title, poster_path, backdrop_path])

  return null
}

type TrackTVWatchProps = {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  season: number
  episode: number
  episodeName?: string
}

export function TrackTVWatch({
  id,
  name,
  poster_path,
  backdrop_path,
  season,
  episode,
  episodeName,
}: TrackTVWatchProps) {
  useEffect(() => {
    saveEpisode(
      { id, name, poster_path, backdrop_path },
      season,
      episode,
      episodeName
    )
  }, [id, name, poster_path, backdrop_path, season, episode, episodeName])

  return null
}
