import Image from "next/image";

const AnimeList = ({ title, images, score, rank, episode, type }) => {
    return (
        <div
            className="bg-gray-900 p-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 group overflow-hidden"
            title={title} // untuk aksesibilitas
        >
            <div className="relative w-full h-[200px] overflow-hidden rounded-md">
                <Image
                    src={images}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:brightness-75 transition duration-300"
                    loading="lazy"
                />
                {/* Overlay saat hover */}
                <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-medium">
                    {type} • {episode} eps
                </div>
            </div>
            <h3 className="text-white mt-2 text-sm font-semibold truncate" title={title}>
                {title}
            </h3>
            <p className="text-gray-400 text-xs mt-1">⭐ {score ?? 'N/A'} | Rank #{rank ?? '?'}</p>
        </div>
    );
};

export default AnimeList;
