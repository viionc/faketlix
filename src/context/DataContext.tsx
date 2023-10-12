import {ReactNode, createContext, useContext, useReducer, useState} from "react";
import {
    DataContextProps,
    DataReducerAction,
    DataReducerState,
    MovieCredits,
    MovieDetails,
    MovieInformation,
    EntryProps,
    TVSeriesInformation,
} from "../types/types";
import {
    fetchMovieCredits,
    fetchMovieDetails,
    fetchMovieInformation,
    fetchMoviesByGenre,
    fetchDataByIds,
    fetchTVSeriesInformation,
    fetchSimilar,
} from "../utils/fetchData";
import {useFirebaseContext} from "./FirebaseContext";
import {MOVIE_GENRES} from "../types/constants";
import {useLocalStorage} from "../hooks/useLocalStorage";

const DataContext = createContext<DataContextProps | null>(null);

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Couldn't initialize Data Context.");
    return context;
};

const REDUCER_INITAL_STATE: DataReducerState = {
    topRatedMovies: [],
    featuredMovie: null,
    popularMovies: [],
    planToWatchMovies: [],
    favoritedMovies: [],
    moviesByGenre: {},
    upcomingMovies: [],
    trendingMoviesInPoland: [],
    topRatedTVSeries: [],
    featuredTVSeries: null,
    popularTVSeries: [],
    planToWatchTVSeries: [],
    favoritedTVSeries: [],
    TVSeriesByGenre: {},
    upcomingTVSeries: [],
    trendingTVSeriesInPoland: [],
};

const dataReducer = (state: DataReducerState, action: DataReducerAction) => {
    const {type, payload} = action;
    switch (type) {
        case "UPDATE_MOVIES":
            return {
                ...state,
                [payload.name]: payload.data,
            };
        default:
            return state;
    }
};

function DataContextProvider({children}: {children: ReactNode}) {
    const [moviesByGenre, setMoviesByGenre] = useState<Record<string, EntryProps[]>>({});
    const [localStoragePTWMovies, setLocalStoragePTWMovies] = useLocalStorage("ptw-movies", [] as EntryProps[]);
    const [localStoragePTWTVSeries, setLocalStoragePTWTVSeries] = useLocalStorage("ptw-tvseries", [] as EntryProps[]);
    const [localStorageFavoriteMovies, setLocalStorageFavoriteMovies] = useLocalStorage("fav-movies", [] as EntryProps[]);
    const [localStorageFavoriteTVSeries, setLocalStorageFavoriteTVSeries] = useLocalStorage("fav-tvseries", [] as EntryProps[]);

    const [dataState, dataDispatch] = useReducer(dataReducer, REDUCER_INITAL_STATE);
    const {currentProfile} = useFirebaseContext();

    const getMoviesByGenre = async (genres: number[]): Promise<boolean> => {
        let response = await fetchMoviesByGenre(genres[0]);
        if (!response) {
            return false;
        }
        let genre = MOVIE_GENRES[genres[0]];
        setMoviesByGenre(prev => {
            return (prev = {
                ...prev,
                [genre]: response as EntryProps[],
            });
        });

        response = await fetchMoviesByGenre(genres[1]);
        if (!response) {
            return false;
        }
        genre = MOVIE_GENRES[genres[1]];
        setMoviesByGenre(prev => {
            return (prev = {
                ...prev,
                [genre]: response as EntryProps[],
            });
        });

        return true;
    };

    const getMovieInformation = async (id: number): Promise<false | MovieInformation> => {
        const response = await fetchMovieInformation(id);
        if (!response) {
            return false;
        }
        return response;
    };

    const getTVSeriesInformation = async (id: number): Promise<false | TVSeriesInformation> => {
        const response = await fetchTVSeriesInformation(id);
        if (!response) {
            return false;
        }
        return response;
    };
    const getMovieCredits = async (id: number): Promise<false | MovieCredits> => {
        const response = await fetchMovieCredits(id);
        if (!response) {
            return false;
        }
        return response;
    };

    const getMovieDetails = async (id: number): Promise<false | MovieDetails> => {
        const response = await fetchMovieDetails(id);
        if (!response) {
            return false;
        }
        return response;
    };
    const getSimilar = async (entry: EntryProps): Promise<false | EntryProps[]> => {
        const response = await fetchSimilar(entry);
        if (!response) {
            return false;
        }
        return response;
    };

    const getPlanToWatchData = async (): Promise<boolean> => {
        if (!currentProfile) return false;
        const movies = [] as EntryProps[];
        let idsToFetch = [] as number[];
        currentProfile.planToWatch.movieIds.forEach(id => {
            const movie = localStoragePTWMovies.find(m => m.id === id);
            if (movie) {
                movies.push(movie);
            } else {
                idsToFetch.push(id);
            }
        });
        let response = await fetchDataByIds("movie", idsToFetch);
        if (response) {
            movies.push(...(response as EntryProps[]));
            setLocalStoragePTWMovies(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "planToWatchMovies", data: movies}});

        const tvSeriesArray = [] as EntryProps[];
        idsToFetch = [] as number[];
        currentProfile.planToWatch.tvIds.forEach(id => {
            const tvSeries = localStoragePTWTVSeries.find(m => m.id === id);
            if (tvSeries) {
                tvSeriesArray.push(tvSeries);
            } else {
                idsToFetch.push(id);
            }
        });
        response = await fetchDataByIds("tv", idsToFetch);
        if (response) {
            tvSeriesArray.push(...(response as EntryProps[]));
            setLocalStoragePTWTVSeries(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "planToWatchTVSeries", data: tvSeriesArray}});

        return true;
    };

    const getFavoritesData = async (): Promise<boolean> => {
        if (!currentProfile) return false;
        const movies = [] as EntryProps[];
        let idsToFetch = [] as number[];
        currentProfile.favoritedMovies.movieIds.forEach(id => {
            const movie = localStorageFavoriteMovies.find(m => m.id === id);
            if (movie) {
                movies.push(movie);
            } else {
                idsToFetch.push(id);
            }
        });
        let response = await fetchDataByIds("movie", idsToFetch);
        if (response) {
            movies.push(...(response as EntryProps[]));
            setLocalStorageFavoriteMovies(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "favoritedMovies", data: movies}});

        const tvSeriesArray = [] as EntryProps[];
        idsToFetch = [] as number[];
        currentProfile.favoritedMovies.tvIds.forEach(id => {
            const tvSeries = localStorageFavoriteTVSeries.find(m => m.id === id);
            if (tvSeries) {
                tvSeriesArray.push(tvSeries);
            } else {
                idsToFetch.push(id);
            }
        });
        response = await fetchDataByIds("tv", idsToFetch);
        if (response) {
            tvSeriesArray.push(...(response as EntryProps[]));
            setLocalStorageFavoriteTVSeries(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "favoritedTVSeries", data: tvSeriesArray}});

        return true;
    };

    return (
        <DataContext.Provider
            value={{
                dataState,
                moviesByGenre,
                getMovieCredits,
                getMovieDetails,
                getSimilar,
                getMovieInformation,
                getMoviesByGenre,
                getPlanToWatchData,
                getFavoritesData,
                getTVSeriesInformation,
                dataDispatch,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
export default DataContextProvider;
// const getTrailer = async (type: "movie" | "tv", id: number): Promise<false | string> => {
//     const trailer = await fetchTrailer(type, id);
//     if (!trailer) {
//         return false;
//     }
//     return trailer;
// };

// const getUpcomingMovies = async (): Promise<boolean> => {
//     const movies = await fetchUpcomingMovies();
//     if (!movies) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "upcomingMovies", data: movies}});
//     return true;
// };

// const getUpcomingTVSeries = async (): Promise<boolean> => {
//     const tvseries = await fetchUpcomingTVSeries();
//     if (!tvseries) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "upcomingTVSeries", data: tvseries}});
//     return true;
// };

// const getTrendingMoviesInPoland = async (): Promise<boolean> => {
//     const movies = await fetchTrendingMoviesInPoland();
//     if (!movies) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "trendingMoviesInPoland", data: movies.slice(0, 10)}});
//     return true;
// };

// const getTrendingTVSeriesInPoland = async (): Promise<boolean> => {
//     const tvseries = await fetchTrendingTVSeriesInPoland();
//     if (!tvseries) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "trendingTVSeriesInPoland", data: tvseries.slice(0, 10)}});
//     return true;
// };
// const getPopularMovies = async (): Promise<boolean> => {
//     const movies = await fetchPopularMovies();
//     if (!movies) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "popularMovies", data: movies}});
//     return true;
// };

// const getTopRatedTVSeries = async (): Promise<boolean> => {
//     const tvseries = await fetchTopRatedTVSeries();
//     if (!tvseries) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "topRatedTVSeries", data: tvseries}});
//     const number = Math.floor(Math.random() * tvseries.length);
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "featuredTVSeries", data: tvseries[number]}});
//     return true;
// };

// const getPopularTVSeries = async (): Promise<boolean> => {
//     const tvseries = await fetchPopularTVSeries();
//     if (!tvseries) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "popularTVSeries", data: tvseries}});
//     return true;
// };

// const getLogo = async (type: "movie" | "tv", id: number): Promise<false | string> => {
//     const logo = await fetchLogo(type, id);
//     if (!logo) {
//         return false;
//     }
//     return logo;
// };
// const getTopRatedMovies = async (): Promise<boolean> => {
//     const movies = await fetchTopRatedMovies();
//     if (!movies) {
//         return false;
//     }
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "topRatedMovies", data: movies}});
//     const number = Math.floor(Math.random() * movies.length);
//     dataDispatch({type: "UPDATE_MOVIES", payload: {name: "featuredMovie", data: movies[number]}});
//     return true;
// };
