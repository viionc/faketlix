import {ReactNode, createContext, useContext, useState} from "react";
import {DataContextProps, MovieCredits, MovieDetails, MovieProps} from "../types/types";
import {
    fetchMovieCredits,
    fetchMovieDetails,
    fetchMovieLogo,
    fetchMovieTrailer,
    fetchPopularMovies,
    fetchSimilarMovies,
    fetchTopRatedMovies,
} from "../utils/fetchData";
import {useFirebaseContext} from "./FirebaseContext";

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
    const [allMovies, setAllMovies] = useState<MovieProps[]>([]);

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
        if (!currentProfile.favoritedMovies.length) return;
        allMovies.forEach(movie => {
            if (currentProfile.favoritedMovies.includes(movie.id)) {
                if (favoritedMovies && favoritedMovies.find(m => m.id === movie.id)) return;
                setFavoritedMovies(prev => [...(prev || []), movie]);
            }
        });
    };

    return (
        <DataContext.Provider
            value={{
                topRatedMovies,
                featuredMovie,
                popularMovies,
                planToWatch,
                favoritedMovies,
                getTopRatedMovies,
                getPopularMovies,
                getMovieLogo,
                getMovieCredits,
                getMovieDetails,
                getSimilarMovies,
                getMovieTrailer,
                checkPlanToWatch,
                checkFavorites,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
export default DataContextProvider;
