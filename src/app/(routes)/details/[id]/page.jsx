import React from 'react';

async function getAnimeDetails(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();
    return data.data;
}

async function getCharacters(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
    const data = await res.json();
    return data.data;
}

async function getImages(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/pictures`);
    const data = await res.json();
    return data.data;
}

async function getReviews(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
    const data = await res.json();
    return data.data;
}

export default async function AnimeDetailPage({ params }) {
    const anime = await getAnimeDetails(params.id);
    const characters = await getCharacters(params.id);
    const images = await getImages(params.id);
    const reviews = await getReviews(params.id);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Trailer */}
                {anime.trailer?.embed_url && (
                    <div className="mb-6">
                        <iframe
                            width="100%"
                            height="400"
                            src={anime.trailer.embed_url}
                            title="Anime Trailer"
                            allowFullScreen
                            className="rounded-lg"
                        ></iframe>
                    </div>
                )}

                {/* Header Detail */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 w-full">
                        <img
                            src={anime.images.jpg.large_image_url}
                            alt={anime.title}
                            className="rounded-lg shadow-md w-full object-cover"
                        />
                    </div>

                    <div className="md:w-2/3 w-full space-y-4">
                        <h1 className="text-3xl font-bold text-white">{anime.title}</h1>
                        <p className="text-gray-300 text-sm italic">{anime.title_japanese}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span><strong>Skor:</strong> {anime.score || 'N/A'} ⭐</span>
                            <span><strong>Episodes:</strong> {anime.episodes || 'Unknown'}</span>
                            <span><strong>Status:</strong> {anime.status}</span>
                            <span><strong>Rating:</strong> {anime.rating || 'N/A'}</span>
                            <span><strong>Duration:</strong> {anime.duration}</span>
                            <span><strong>Studio:</strong> {anime.studios.map(s => s.name).join(', ')}</span>
                            <span><strong>Aired:</strong> {anime.aired.string}</span>
                            <span><strong>Source:</strong> {anime.source}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {anime.genres.map(genre => (
                                <span
                                    key={genre.mal_id}
                                    className="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-200 text-justify leading-relaxed">
                            {anime.synopsis || 'Sinopsis tidak tersedia.'}
                        </p>

                        <a
                            href={anime.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-red-500 hover:underline"
                        >
                            Lihat di MyAnimeList →
                        </a>
                    </div>
                </div>

                {/* Characters */}
                <h2 className="text-2xl font-bold mt-12 mb-4">Characters</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {characters.slice(0, 8).map(char => (
                        <div key={char.character.mal_id} className="text-center">
                            <img
                                src={char.character.images.jpg.image_url}
                                alt={char.character.name}
                                className="rounded-lg w-full object-cover"
                            />
                            <p className="mt-2 text-sm">{char.character.name}</p>
                        </div>
                    ))}
                </div>

                {/* Gallery */}
                <h2 className="text-2xl font-bold mt-12 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.slice(0, 8).map((img, idx) => (
                        <img
                            key={idx}
                            src={img.jpg.image_url}
                            alt={`Gallery ${idx}`}
                            className="rounded-md"
                        />
                    ))}
                </div>

                {/* Reviews */}
                <h2 className="text-2xl font-bold mt-12 mb-4">Reviews</h2>
                <div className="space-y-4">
                    {reviews.slice(0, 3).map(review => (
                        <div key={review.mal_id} className="bg-gray-800 p-4 rounded-md">
                            <p className="text-sm text-gray-300">By: {review.user.username}</p>
                            <p className="text-white mt-2">{review.review.slice(0, 300)}...</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
