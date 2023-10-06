import {MovieProps} from "../types/types";

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
