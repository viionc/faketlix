export const MOVIE_GENRES: Record<number, string> = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Science Fiction",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV Movie",
};

export const TV_GENRES: Record<number, string> = {
    16: "Animation",
    18: "Drama",
    35: "Comedy",
    37: "Western",
    80: "Crime",
    99: "Documentary",
    9648: "Mystery",
    10751: "Family",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
};

export const IMAGE_ORIGINAL_PATH = "https://image.tmdb.org/t/p/original";
export const IMAGE_SMALL_PATH = "https://image.tmdb.org/t/p/w500";

export const PROFILE_COLORS = [
    "bg-blue-400",
    "bg-green-500",
    "bg-red-500",
    "bg-zinc-500",
    "bg-yellow-600",
    "bg-pink-600",
    "bg-purple-600",
    "bg-teal-600",
    "bg-indigo-900",
    "bg-orange-600",
] as const;
