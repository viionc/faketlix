import stringSimilarity from "string-similarity-js";
import {EntryProps, EntryTypes, MovieCredits, MovieDetails, MovieInformation, TVSeriesInformation} from "../types/types";

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_ACCESS_TOKEN}`,
    },
};

export const fetchTopRatedMovies = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options);
        if (!response.ok) return false;

        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: EntryProps) => ({...result, type: "movie"}));
    return response;
};

export const fetchTopRatedTVSeries = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1", options);
        if (!response.ok) return false;

        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: {name: string}) => ({...result, title: result.name, adult: false, type: "tv"}));

    return response;
};

export const fetchPopularTVSeries = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=1", options);
        if (!response.ok) return false;

        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: {name: string}) => ({...result, title: result.name, adult: false, type: "tv"}));
    return response;
};

export const fetchUpcomingMovies = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/movie/upcoming", options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: EntryProps) => ({...result, type: "movie"}));
    return response;
};

export const fetchUpcomingTVSeries = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/tv/on_the_air", options);
        if (!response.ok) return false;

        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: {name: string}) => ({...result, title: result.name, adult: false, type: "tv"}));
    return response;
};

export const fetchTrendingTVSeriesInPoland = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/trending/tv/week", options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: {name: string}) => ({...result, title: result.name, adult: false, type: "tv"})).slice(0, 10);
    return response;
};

export const fetchTrendingMoviesInPoland = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/movie/popular?region=PL", options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    response = response.results.map((result: EntryProps) => ({...result, type: "movie"})).slice(0, 10);
    return response;
};

export const fetchPopularMovies = async (): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: EntryProps) => ({...result, type: "movie"}));
    return response;
};

export const fetchByGenre = async (type: EntryTypes, genre: number): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/discover/${type}?with_genres=${genre}`, options);
        if (!response.ok) {
            return false;
        }
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    response = response.results.map((result: EntryProps) => ({...result, type: type}));
    return response;
};

export const fetchDataByIds = async (type: EntryTypes, ids: number[]): Promise<false | EntryProps[]> => {
    const entries = [] as EntryProps[];
    let response;

    for (const id of ids) {
        try {
            response = await fetch(`https://api.themoviedb.org/3/${type}/${id}`, options);
            if (!response.ok) return false;
            response = await response.json();
            const ids = response.genres.map((g: {id: number}) => g.id);
            const movie = {...response, genre_ids: ids, adult: response.adult || false, title: response.title || response.name, type: type};
            // response = response.results.map((result: any) => ({...result, title: result.name, adult: false}));
            entries.push(movie);
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    return entries;
};

interface Logo {
    iso_639_1: string;
    file_path: string;
}

interface Crew {
    known_for_department: string;
    name: string;
}
interface Trailer {
    type: string;
    key: string;
}
interface Keyword {
    name: string;
}
interface Cast {
    name: string;
}

export const fetchMovieInformation = async (id: number): Promise<false | MovieInformation> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=images,videos,credits,keywords,details`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    let logo = await fetchLogo("movie", id);
    if (!logo) logo = "noimage.png";
    const cast = response.credits.cast.slice(0, 4).map((c: Cast) => c.name);
    let director = response.credits.crew.find((crew: Crew) => crew.known_for_department === "Directing")?.name;
    const hours = Math.floor(response.runtime / 60);
    const minutes = Math.floor(response.runtime % 60);
    const runtime = `${hours ? hours + "h " : null}${minutes}m`;
    const trailerURL = response.videos.results.filter((trailer: Trailer) => trailer.type === "Trailer")[0].key;
    const keywords = response.keywords.keywords.map((k: Keyword) => k.name);
    if (!director) director = "Unknown";

    const movie: MovieInformation = {
        type: "movie",
        id: response.id,
        adult: response.adult,
        logoURL: logo,
        cast,
        director,
        runtime,
        trailerURL,
        genre_ids: response.genre_ids,
        backdrop_path: response.backdrop_path,
        title: response.title,
        overview: response.overview,
        vote_average: response.vote_average,
        keywords,
        similar: [],
        release_date: response.release_date,
        vote_count: response.vote_count,
        poster_path: response.poster_path,
    };
    return movie;
};

export const fetchTVSeriesInformation = async (id: number): Promise<false | TVSeriesInformation> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/tv/${id}?append_to_response=videos,credits,keywords,details`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const title = response.name;
    let logo = await fetchLogo("tv", id);
    if (!logo) logo = "noimage.png";
    // const englishLogo = response.images.logos.find((logo: Logo) => logo.iso_639_1 === "en");
    // const logo = englishLogo ? englishLogo.file_path : response.images.logos[0].file_path;
    const cast = response.credits.cast.slice(0, 5).map((c: Cast) => c.name);
    let director = response.credits.crew.find((crew: Crew) => crew.known_for_department === "Directing")?.name;
    let trailerURL = response.videos.results.find((trailer: Trailer) => trailer.type === "Trailer");
    trailerURL = trailerURL ? trailerURL.key : "notrailer";
    const keywords = response.keywords.results.map((k: Keyword) => k.name);
    if (!director) director = "Unknown";

    const tvseries: TVSeriesInformation = {
        type: "tv",
        id: response.id,
        adult: response.adult,
        logoURL: logo,
        cast,
        director,
        trailerURL,
        genre_ids: response.genre_ids,
        backdrop_path: response.backdrop_path,
        title,
        overview: response.overview,
        vote_average: response.vote_average,
        keywords,
        similar: [],
        release_date: response.first_air_date,
        vote_count: response.vote_count,
        poster_path: response.poster_path,
        number_of_episodes: response.number_of_episodes,
        number_of_seasons: response.number_of_seasons,
    };

    return tvseries;
};

export const fetchLogo = async (type: EntryTypes, id: number): Promise<false | string> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const englishLogo = response.logos.find((logo: Logo) => logo.iso_639_1 === "en");
    const logo = englishLogo ? englishLogo.file_path : response.logos[0].file_path;
    const hasLogo = logo ? logo : "noimage.png";
    return hasLogo;
};

export const fetchMovieCredits = async (movieId: number): Promise<false | MovieCredits> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    const cast = response.cast.slice(0, 4);
    let director = response.crew.find((crew: {known_for_department: string}) => crew.known_for_department === "Directing")?.name;
    if (!director) director = "Unknown";
    return {cast, director};
};

export const fetchMovieDetails = async (movieId: number): Promise<false | MovieDetails> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    const hours = Math.floor(response.runtime / 60);
    const minutes = Math.floor(response.runtime % 60);
    const runtime = `${hours ? hours + "h " : null}${minutes}m`;
    return {
        adult: response.adult,
        release_date: response.release_date.split("-")[0],
        runtime,
    };
};

export const fetchSimilar = async (entry: EntryProps): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/discover/${entry.type}?with_genres=${entry.genre_ids.join(",")}`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const entries = response.results
        .filter((m: {id: number}) => m.id !== entry.id)
        .sort(() => Math.random() - 0.5)
        .map((e: EntryProps) => ({
            ...e,
            type: entry.type,
        }))
        .slice(0, 9);
    return entries;
};

export const fetchTrailer = async (type: EntryTypes, id: number): Promise<false | string> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    let trailerURL = response.results.filter((trailer: {type: string}) => trailer.type === "Trailer")[0];
    trailerURL = trailerURL ? trailerURL.key : "notrailer";
    return trailerURL;
};

export const fetchByName = async (query: string): Promise<false | EntryProps[]> => {
    let response;
    try {
        response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const movieEntries = response.results.map((e: EntryProps) => ({
        ...e,
        type: "movie",
    }));
    try {
        response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`, options);
        if (!response.ok) return false;
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const TVEntries = response.results.map((e: any) => ({
        ...e,
        adult: e.adult || false,
        title: e.title || e.name,
        type: "tv",
    }));
    const allEntries = [...movieEntries, ...TVEntries];
    const bestPossibiltity = allEntries
        .sort((a: EntryProps, b: EntryProps) => stringSimilarity(b.title, a.title))
        .sort((a: EntryProps, b: EntryProps) => b.vote_count - a.vote_count);
    return bestPossibiltity;
};
