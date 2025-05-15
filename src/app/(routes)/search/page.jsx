'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const SearchResults = () => {
    const { query } = useParams()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`)
                const data = await res.json()
                setResults(data.data)
            } catch (err) {
                console.error("Gagal fetch data pencarian:", err)
            } finally {
                setLoading(false)
            }
        }

        if (query) fetchData()
    }, [query])

    if (loading) {
        return <div className="text-white text-center mt-10">Memuat hasil pencarian...</div>
    }

    if (!results || results.length === 0) {
        return <div className="text-white text-center mt-10">Tidak ada hasil untuk "{query}"</div>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {results.map(anime => (
                <Link key={anime.mal_id} href={`/details/${anime.mal_id}`} className="bg-gray-800 rounded p-2 hover:shadow-lg hover:scale-105 transition">
                    <img src={anime.images.jpg.image_url} alt={anime.title} className="rounded w-full h-48 object-cover" />
                    <p className="text-sm text-white mt-2">{anime.title}</p>
                </Link>
            ))}
        </div>
    )
}

export default SearchResults
