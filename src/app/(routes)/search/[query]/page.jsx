'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

const SearchResultsPage = () => {
    const { query } = useParams()
    const router = useRouter()
    const [results, setResults] = useState([])
    const [searchInput, setSearchInput] = useState(query || "")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`)
                const data = await res.json()
                setResults(Array.isArray(data.data) ? data.data : [])
            } catch (err) {
                console.error("Gagal fetch data pencarian:", err)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        if (query) fetchData()
    }, [query])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchInput.trim()) return
        router.push(`/search/${encodeURIComponent(searchInput.trim())}`)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header Search */}
            <div className="flex justify-end px-6 py-4 bg-gray-800 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Cari anime..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="border border-gray-700 bg-gray-700 text-white px-3 py-1 rounded w-64"
                    />
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Hasil Pencarian */}
            <div className="p-6">
                {loading ? (
                    <div className="text-center mt-10">Memuat hasil pencarian...</div>
                ) : results.length === 0 ? (
                    <div className="text-center mt-10">Tidak ada hasil untuk "{query}"</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {results.map(anime => (
                            <Link
                                key={anime.mal_id}
                                href={`/details/${anime.mal_id}`}
                                className="bg-gray-800 rounded p-2 hover:shadow-lg hover:scale-105 transition"
                            >
                                <img
                                    src={anime.images.jpg.image_url}
                                    alt={anime.title}
                                    className="rounded w-full h-48 object-cover"
                                />
                                <p className="text-sm text-white mt-2 line-clamp-2">{anime.title}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResultsPage
