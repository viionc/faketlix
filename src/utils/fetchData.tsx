import {MovieCredits, MovieDetails, MovieInformation, MovieInformationResponse, MovieProps} from "../types/types";

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_ACCESS_TOKEN}`,
    },
};
interface MovieResponse extends Response {
    results: MovieProps[];
}
interface LogoResponse extends Response {
    logos: Array<Logo>;
}
interface Logo {
    iso_639_1: string;
    file_path: string;
}
interface CreditsResponse extends Response {
    crew: Array<{known_for_department: string; name: string}>;
    cast: Array<{name: string}>;
}
interface DetailsResponse extends Response {
    adult: boolean;
    release_date: string;
    runtime: number;
}
interface SimilarMoviesResponse extends Response {
    results: Array<MovieProps>;
}
interface TrailerResponse extends Response {
    results: Array<{key: string; type: string}>;
}

//https://api.themoviedb.org/3/movie/upcoming
//https://api.themoviedb.org/3/movie/popular?region=PL

export const fetchTopRatedMovies = async (): Promise<false | MovieProps[]> => {
    let topRatedResponse = {} as MovieResponse;
    try {
        topRatedResponse = (await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options)) as MovieResponse;
        if (!topRatedResponse.ok) {
            return false;
        }
        topRatedResponse = await topRatedResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    return topRatedResponse.results;
};

export const fetchUpcomingMovies = async (): Promise<false | MovieProps[]> => {
    let response = {} as MovieResponse;
    try {
        response = (await fetch("https://api.themoviedb.org/3/movie/upcoming", options)) as MovieResponse;
        if (!response.ok) {
            return false;
        }
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    return response.results;
};

export const fetchTrendingInPoland = async (): Promise<false | MovieProps[]> => {
    let response = {} as MovieResponse;
    try {
        response = (await fetch("https://api.themoviedb.org/3/movie/popular?region=PL", options)) as MovieResponse;
        if (!response.ok) {
            return false;
        }
        response = await response.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    return response.results;
};

export const fetchPopularMovies = async (): Promise<false | MovieProps[]> => {
    let popularMoviesResponse = {} as MovieResponse;
    try {
        popularMoviesResponse = (await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options)) as MovieResponse;
        if (!popularMoviesResponse.ok) {
            return false;
        }
        popularMoviesResponse = await popularMoviesResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    return popularMoviesResponse.results;
};

export const fetchMoviesByGenre = async (genre: number): Promise<false | MovieProps[]> => {
    let movies = {} as MovieResponse;
    try {
        movies = (await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genre}`, options)) as MovieResponse;
        if (!movies.ok) {
            return false;
        }
        movies = await movies.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    return movies.results;
};

export const fetchMovieInformation = async (movieId: number): Promise<false | MovieInformation> => {
    let movieInformationResponse = {} as MovieInformationResponse;
    try {
        movieInformationResponse = (await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images,videos,credits,keywords,details`,
            options
        )) as MovieInformationResponse;
        if (!movieInformationResponse.ok) {
            return false;
        }

        movieInformationResponse = await movieInformationResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    const englishLogo = movieInformationResponse.images.logos.find(logo => logo.iso_639_1 === "en");
    const logo = englishLogo ? englishLogo.file_path : movieInformationResponse.images.logos[0].file_path;
    const cast = movieInformationResponse.credits.cast.slice(0, 4).map(c => c.name);
    let director = movieInformationResponse.credits.crew.find(crew => crew.known_for_department === "Directing")?.name;
    const hours = Math.floor(movieInformationResponse.runtime / 60);
    const minutes = Math.floor(movieInformationResponse.runtime % 60);
    const runtime = `${hours ? hours + "h " : null}${minutes}m`;
    const trailerURL = movieInformationResponse.videos.results.filter(r => r.type === "Trailer")[0].key;
    const keywords = movieInformationResponse.keywords.keywords.map(k => k.name);
    if (!director) director = "Unknown";

    const movie: MovieInformation = {
        id: movieInformationResponse.id,
        adult: movieInformationResponse.adult,
        logoURL: logo,
        cast,
        director,
        runtime,
        trailerURL,
        genre_ids: movieInformationResponse.genre_ids,
        backdrop_path: movieInformationResponse.backdrop_path,
        title: movieInformationResponse.title,
        overview: movieInformationResponse.overview,
        vote_average: movieInformationResponse.vote_average,
        keywords,
        similar: [],
        release_date: movieInformationResponse.release_date,
        vote_count: movieInformationResponse.vote_count,
        poster_path: movieInformationResponse.poster_path,
    };
    console.log(movie);
    return movie;
};

export const fetchMovieLogo = async (movieId: number): Promise<false | string> => {
    let logoResponse = {} as LogoResponse;
    fetchMovieInformation(2);
    try {
        logoResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)) as LogoResponse;
        if (!logoResponse.ok) {
            return false;
        }
        logoResponse = await logoResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const englishLogo = logoResponse.logos.find(logo => logo.iso_639_1 === "en");
    const logo = englishLogo ? englishLogo.file_path : logoResponse.logos[0].file_path;
    return logo;
};

export const fetchMovieCredits = async (movieId: number): Promise<false | MovieCredits> => {
    let creditsResponse = {} as CreditsResponse;
    try {
        creditsResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options)) as CreditsResponse;
        if (!creditsResponse.ok) {
            return false;
        }
        creditsResponse = await creditsResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    const cast = creditsResponse.cast.slice(0, 4);
    let director = creditsResponse.crew.find(crew => crew.known_for_department === "Directing")?.name;
    if (!director) director = "Unknown";
    return {cast, director};
};

export const fetchMovieDetails = async (movieId: number): Promise<false | MovieDetails> => {
    let detailsResponse = {} as DetailsResponse;
    try {
        detailsResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)) as DetailsResponse;
        if (!detailsResponse.ok) {
            return false;
        }
        detailsResponse = await detailsResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }

    const hours = Math.floor(detailsResponse.runtime / 60);
    const minutes = Math.floor(detailsResponse.runtime % 60);
    const runtime = `${hours ? hours + "h " : null}${minutes}m`;
    return {
        adult: detailsResponse.adult,
        release_date: detailsResponse.release_date.split("-")[0],
        runtime,
    };
};

export const fetchSimilarMovies = async (movie: MovieProps): Promise<false | MovieProps[]> => {
    let similarMoviesResponse = {} as SimilarMoviesResponse;
    try {
        similarMoviesResponse = (await fetch(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${movie.genre_ids.join(",")}`,
            options
        )) as SimilarMoviesResponse;

        if (!similarMoviesResponse.ok) {
            return false;
        }
        similarMoviesResponse = await similarMoviesResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    const movies = similarMoviesResponse.results
        .filter(m => m.id !== movie.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 9);
    return movies;
};

export const fetchMovieTrailer = async (movieId: number): Promise<false | string> => {
    let trailerResponse = {} as TrailerResponse;
    try {
        trailerResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, options)) as TrailerResponse;
        if (!trailerResponse.ok) {
            return false;
        }
        trailerResponse = await trailerResponse.json();
    } catch (err) {
        console.error(err);
        return false;
    }
    return trailerResponse.results.filter(r => r.type === "Trailer")[0].key;
};
