"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
    const [characters, setCharacters] = useState([]);
    const [topCharacters, setTopCharacters] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCharacters = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.jikan.moe/v4/characters?page=${page}&limit=20`,
                    { signal: controller.signal }
                );
                const data = await res.json();
                setCharacters(data.data);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching characters:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();

        return () => controller.abort();
    }, [page]);

    useEffect(() => {
        const fetchTopCharacters = async () => {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/top/characters`);
                const data = await res.json();
                setTopCharacters(data.data.slice(0, 8));
            } catch (error) {
                console.error("Error fetching top characters:", error);
            }
        };

        fetchTopCharacters();
    }, []);

    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-black text-white px-4 py-8">
            {/* Top Character */}
            <h2 className="text-3xl font-bold mb-4">Top Character</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4 mb-10">
                {topCharacters.map((char) => (
                    <Link key={char.mal_id} href={`/character/${char.mal_id}`}>
                        <div className="border border-white bg-gray-900 rounded-lg overflow-hidden hover:-translate-y-2 transition-transform shadow">
                            <img
                                src={char.images?.jpg?.image_url}
                                alt={char.name}
                                className="w-full h-40 object-cover"
                            />
                            <p className="text-center font-semibold p-2">{char.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* All Character */}
            <h1 className="text-3xl font-bold mb-6 text-center">All Character</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {loading
                    ? Array.from({ length: 20 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 animate-pulse h-64 rounded-lg"
                        ></div>
                    ))
                    : characters.map((char) => (
                        <Link key={char.mal_id} href={`/character/${char.mal_id}`}>
                            <div className="border border-white bg-gray-900 rounded-lg overflow-hidden hover:-translate-y-2 transition-transform shadow">
                                <img
                                    src={char.images?.jpg?.image_url}
                                    alt={char.name}
                                    className="w-full h-48 object-cover"
                                />
                                <p className="text-center font-semibold p-2">{char.name}</p>
                            </div>
                        </Link>
                    ))}
            </div>

            {/* Navigation Buttons */}
            {!loading && (
                <div className="flex justify-center mt-10 space-x-4">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="border border-white text-gray-400 hover:text-white px-6 py-2 rounded-md transition disabled:opacity-50"
                    >
                        &#x276E; Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="border border-white text-white hover:bg-white hover:text-black px-6 py-2 rounded-md transition"
                    >
                        Next &#x276F;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Page;
