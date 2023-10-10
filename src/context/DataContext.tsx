import {ReactNode, createContext, useContext, useState} from "react";
import {DataContextProps, MovieCredits, MovieDetails, MovieInformation, MovieProps} from "../types/types";
import {
    fetchMovieCredits,
    fetchMovieDetails,
    fetchMovieInformation,
    fetchMovieLogo,
    fetchMovieTrailer,
    fetchMoviesByGenre,
    fetchPopularMovies,
    fetchSimilarMovies,
    fetchTopRatedMovies,
    fetchTrendingInPoland,
    fetchUpcomingMovies,
} from "../utils/fetchData";
import {useFirebaseContext} from "./FirebaseContext";
import {MOVIE_GENRES} from "../types/constants";

const DataContext = createContext<DataContextProps | null>(null);

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Couldn't initialize Data Context.");
    return context;
};

function DataContextProvider({children}: {children: ReactNode}) {
    const [topRatedMovies, setTopRatedMovies] = useState<MovieProps[] | null>(null);
    const [featuredMovie, setFeaturedMovie] = useState<MovieProps | null>(null);
    const [popularMovies, setPopularMovies] = useState<MovieProps[] | null>(null);
    const [planToWatch, setPlanToWatch] = useState<MovieProps[] | null>(null);
    const [favoritedMovies, setFavoritedMovies] = useState<MovieProps[] | null>(null);
    const [moviesByGenre, setMoviesByGenre] = useState<Record<string, MovieProps[]>>({});
    const [allMovies, setAllMovies] = useState<MovieProps[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<MovieProps[] | null>(null);
    const [trendingInPoland, setTrendingInPoland] = useState<MovieProps[] | null>(null);

    const {currentProfile} = useFirebaseContext();

    const getTopRatedMovies = async (): Promise<boolean> => {
        const movies = await fetchTopRatedMovies();
        if (!movies) {
            return false;
        }
        setTopRatedMovies(movies);
        const number = Math.floor(Math.random() * movies.length);
        setFeaturedMovie(movies[number]);
        setAllMovies(prev => [...prev, ...movies]);
        return true;
    };

    const getMoviesByGenre = async (genres: number[]): Promise<boolean> => {
        let movies = await fetchMoviesByGenre(genres[0]);
        if (!movies) {
            return false;
        }
        let genre = MOVIE_GENRES[genres[0]];
        setMoviesByGenre(prev => {
            return (prev = {
                ...prev,
                [genre]: movies as MovieProps[],
            });
        });
        setAllMovies(prev => [...prev, ...(movies as MovieProps[])]);

        movies = await fetchMoviesByGenre(genres[1]);
        if (!movies) {
            return false;
        }
        genre = MOVIE_GENRES[genres[1]];
        setMoviesByGenre(prev => {
            return (prev = {
                ...prev,
                [genre]: movies as MovieProps[],
            });
        });
        setAllMovies(prev => [...prev, ...(movies as MovieProps[])]);

        return true;
    };
    const getPopularMovies = async (): Promise<boolean> => {
        const movies = await fetchPopularMovies();
        if (!movies) {
            return false;
        }
        setPopularMovies(movies);
        setAllMovies(prev => [...prev, ...movies]);
        return true;
    };

    const getMovieLogo = async (movieId: number): Promise<false | string> => {
        const logo = await fetchMovieLogo(movieId);
        if (!logo) {
            return false;
        }
        return logo;
    };

    const getMovieInformation = async (movieId: number): Promise<false | MovieInformation> => {
        const details = await fetchMovieInformation(movieId);
        if (!details) {
            return false;
        }
        return details;
    };
    const getMovieCredits = async (movieId: number): Promise<false | MovieCredits> => {
        const credits = await fetchMovieCredits(movieId);
        if (!credits) {
            return false;
        }
        return credits;
    };

    const getMovieDetails = async (movieId: number): Promise<false | MovieDetails> => {
        const details = await fetchMovieDetails(movieId);
        if (!details) {
            return false;
        }
        return details;
    };
    const getSimilarMovies = async (movie: MovieProps): Promise<false | MovieProps[]> => {
        const similarMovies = await fetchSimilarMovies(movie);
        if (!similarMovies) {
            return false;
        }
        return similarMovies;
    };
    const getMovieTrailer = async (movieId: number): Promise<false | string> => {
        const trailer = await fetchMovieTrailer(movieId);
        if (!trailer) {
            return false;
        }
        return trailer;
    };

    const getUpcomingMovies = async (): Promise<boolean> => {
        const upcomingMovies = await fetchUpcomingMovies();
        if (!upcomingMovies) {
            return false;
        }
        setUpcomingMovies(upcomingMovies);
        setAllMovies(prev => [...prev, ...(upcomingMovies as MovieProps[])]);
        return true;
    };

    const getTrendingInPoland = async (): Promise<boolean> => {
        const trendingInPoland = await fetchTrendingInPoland();
        if (!trendingInPoland) {
            return false;
        }
        setTrendingInPoland(trendingInPoland.slice(0, 10));
        setAllMovies(prev => [...prev, ...(trendingInPoland as MovieProps[])]);
        return true;
    };

    const checkPlanToWatch = () => {
        if (!currentProfile) return;
        if (!currentProfile.planToWatch) return;
        if (!allMovies.length) return;
        const temp = [] as MovieProps[];
        allMovies.forEach(movie => {
            if (currentProfile.planToWatch.includes(movie.id)) {
                temp.push(movie);
            }
        });
        setPlanToWatch(temp);
    };

    const checkFavorites = () => {
        if (!currentProfile) return;
        if (!currentProfile.favoritedMovies) return;
        if (!allMovies.length) return;
        const temp = [] as MovieProps[];
        allMovies.forEach(movie => {
            if (currentProfile.favoritedMovies.includes(movie.id)) {
                temp.push(movie);
            }
        });
        setFavoritedMovies(temp);
    };

    return (
        <DataContext.Provider
            value={{
                topRatedMovies,
                featuredMovie,
                popularMovies,
                planToWatch,
                favoritedMovies,
                moviesByGenre,
                upcomingMovies,
                trendingInPoland,
                getTopRatedMovies,
                getPopularMovies,
                getMovieLogo,
                getMovieCredits,
                getMovieDetails,
                getSimilarMovies,
                getMovieTrailer,
                checkPlanToWatch,
                checkFavorites,
                getMovieInformation,
                getMoviesByGenre,
                getUpcomingMovies,
                getTrendingInPoland,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
export default DataContextProvider;
