'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

export default function Carousel() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopAnime = async () => {
            try {
                const res = await axios.get('https://api.jikan.moe/v4/top/anime');
                const animeData = res.data.data.map((anime) => ({
                    id: anime.mal_id,
                    title: anime.title,
                    rating: anime.score || 'N/A',
                    image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
                }));
                setSlides(animeData.slice(0, 5));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching anime:', err);
                setLoading(false);
            }
        };

        fetchTopAnime();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slides]);

    if (loading) {
        return (
            <div className="h-[500px] flex justify-center items-center text-white text-xl">
                Loading top anime...
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div className="h-[500px] flex justify-center items-center text-white text-xl">
                No anime data available.
            </div>
        );
    }

    const { id, title, rating, image } = slides[currentIndex];

    return (
        <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
            <Image
                src={image}
                alt={title}
                width={1280}
                height={500}
                loading="eager"
                priority
                placeholder="empty"
                className="w-full h-full object-cover brightness-[0.5] transition-opacity duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-10 text-white bg-black/30">
                <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg leading-tight">
                    {title.split(' ')[0]} <br /> {title.split(' ').slice(1).join(' ')}
                </h1>
                <div className="flex items-center mt-4 space-x-4">
                    <span className="text-yellow-400 text-xl">⭐ {rating}</span>
                    <Link href={`/anime/${id}`}>
                        <button className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-300 text-white font-semibold py-2 px-4 rounded-full">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
