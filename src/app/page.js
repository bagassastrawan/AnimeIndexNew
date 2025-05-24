'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const Home = () => {
  const [topAnime, setTopAnime] = useState([])
  const [latestAnime, setLatestAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const [topRes, latestRes] = await Promise.all([
          fetch('https://api.jikan.moe/v4/top/anime'),
          fetch('https://api.jikan.moe/v4/seasons/now'),
        ])

        // Log response status dan OK status
        console.log('Top Anime Response Status:', topRes.status, 'OK:', topRes.ok);
        console.log('Latest Anime Response Status:', latestRes.status, 'OK:', latestRes.ok);

        if (!topRes.ok) {
          const errorText = await topRes.text(); // Coba baca body error
          console.error('Top Anime Fetch Error Body:', errorText);
          throw new Error(`Gagal memuat Top Anime: Status ${topRes.status}`);
        }
        if (!latestRes.ok) {
          const errorText = await latestRes.text(); // Coba baca body error
          console.error('Latest Anime Fetch Error Body:', errorText);
          throw new Error(`Gagal memuat Anime Terbaru: Status ${latestRes.status}`);
        }

        const topData = await topRes.json();
        const latestData = await latestRes.json();

        // Log data yang diterima
        console.log('Fetched Top Anime Data:', topData);
        console.log('Fetched Latest Anime Data:', latestData);

        // Periksa apakah data.data ada dan merupakan array
        if (!topData.data || !Array.isArray(topData.data)) {
          throw new Error('Struktur data Top Anime tidak valid');
        }
        if (!latestData.data || !Array.isArray(latestData.data)) {
          throw new Error('Struktur data Latest Anime tidak valid');
        }


        setTopAnime(topData.data.slice(0, 10))
        setLatestAnime(latestData.data.slice(0, 10))
      } catch (err) {
        console.error('Error fetching anime data:', err); // Log error lengkap
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">AnimeIndex</h1>

      {loading && <p className="text-center text-gray-300">Memuat data...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>} {/* Tampilkan pesan error */}

      {!loading && !error && (
        <>
          {/* Top Anime Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
              Top Anime
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topAnime.map((anime) => (
                <Link
                  key={anime.mal_id}
                  href={`/details/${anime.mal_id}`}
                  className="group bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300"
                >
                  <img
                    src={anime.images?.jpg?.image_url}
                    alt={anime.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold group-hover:text-yellow-400 transition">
                      {anime.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Score: {anime.score ?? 'N/A'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest Anime Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
              Anime Terbaru
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {latestAnime.map((anime) => (
                <Link
                  key={anime.mal_id}
                  href={`/details/${anime.mal_id}`}
                  className="group bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300"
                >
                  <img
                    src={anime.images?.jpg?.image_url}
                    alt={anime.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold group-hover:text-blue-400 transition">
                      {anime.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Episode: {anime.episodes ?? 'TBA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Home