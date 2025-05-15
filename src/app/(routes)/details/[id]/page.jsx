'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AnimeDetailPage() {
    const { id } = useParams()
    const [anime, setAnime] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`)
                const data = await res.json()
                setAnime(data.data)
            } catch (error) {
                console.error('Gagal mengambil data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnime()
    }, [id])

    if (loading) {
        return <div className="text-center text-gray-300 mt-10">Memuat detail anime...</div>
    }

    if (!anime) {
        return <div className="text-center text-red-500 mt-10">Anime tidak ditemukan.</div>
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
                <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full md:w-1/3 rounded shadow-lg"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
                    <p className="text-yellow-400 mb-2">Skor: {anime.score || 'N/A'} ⭐</p>
                    <p className="text-gray-300 mb-2">Episode: {anime.episodes || 'N/A'} | Status: {anime.status}</p>
                    <p className="mb-4 text-gray-400">{anime.synopsis}</p>

                    <div className="mb-2">
                        <span className="font-semibold">Genre:</span>{' '}
                        {anime.genres.map((g) => g.name).join(', ')}
                    </div>
                    <a
                        href={anime.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                        Lihat di MyAnimeList
                    </a>
                </div>
            </div>
        </div>
    )
}
