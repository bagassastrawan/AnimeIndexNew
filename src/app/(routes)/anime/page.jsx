'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const indonesianDays = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu'
};

export default function AnimePage() {
    const [selectedDay, setSelectedDay] = useState('monday');
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAnime = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.jikan.moe/v4/schedules/${selectedDay}`);
                const data = await res.json();

                const sorted = data.data
                    .filter(anime => anime.popularity !== null)
                    .sort((a, b) => a.popularity - b.popularity)
                    .slice(0, 10);

                const formatted = sorted.map(anime => ({
                    id: anime.mal_id,
                    title: anime.title,
                    image: anime.images.jpg.image_url,
                    popularity: anime.popularity,
                    score: anime.score ? `${anime.score} ⭐` : 'N/A',
                    episode: `Episode ${anime.episodes_aired || 'New'}`
                }));

                setAnimeList(formatted);
            } catch (error) {
                console.error('Gagal mengambil data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, [selectedDay]);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-6xl mx-auto p-4">
                <h1 className="text-3xl font-bold text-white mb-6 border-b-2 border-gray-700 pb-2">
                    Jadwal Anime {indonesianDays[selectedDay]}
                </h1>

                {/* Day Selector */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${selectedDay === day
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                }`}
                        >
                            {indonesianDays[day]}
                        </button>
                    ))}
                </div>

                {/* Anime List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-400">Memuat data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {animeList.map(anime => (
                            <Link key={anime.id} href={`/details/${anime.id}`}>
                                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-red-500 transition-colors">
                                    <div className="flex">
                                        <div className="w-1/3">
                                            <img
                                                src={anime.image}
                                                alt={anime.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="w-2/3 p-4">
                                            <h3 className="font-bold text-white text-lg mb-1">{anime.title}</h3>
                                            <p className="text-gray-300 text-sm mb-1">{anime.episode}</p>
                                            <p className="text-yellow-400 text-sm mb-1">{anime.score}</p>
                                            <p className="text-gray-400 text-xs">
                                                <span className="font-medium">Popularitas:</span> #{anime.popularity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
