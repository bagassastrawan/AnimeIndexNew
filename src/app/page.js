'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const Home = () => {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime')
        if (!res.ok) throw new Error('Gagal memuat data')

        const data = await res.json()
        setAnimeList(data.data.slice(0, 10)) // ambil 10 teratas
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTopAnime()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Top Anime</h1>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {animeList.map((anime) => (
          <Link
            key={anime.mal_id}
            href={`/details/${anime.mal_id}`}
            className="bg-gray-800 rounded p-2 shadow hover:scale-105 hover:shadow-lg transition"
          >
            <img
              src={anime.images?.jpg?.image_url}
              alt={anime.title}
              className="w-full h-48 object-cover rounded"
            />
            <p className="mt-2 text-sm font-semibold truncate">{anime.title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
