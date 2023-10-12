import {ReactNode, createContext, useContext, useReducer} from "react";
import {
    DataContextProps,
    DataReducerAction,
    DataReducerState,
    MovieCredits,
    MovieDetails,
    MovieInformation,
    EntryProps,
    TVSeriesInformation,
    DataReducerActionTypes,
} from "../types/types";
import {
    fetchMovieCredits,
    fetchMovieDetails,
    fetchMovieInformation,
    fetchDataByIds,
    fetchTVSeriesInformation,
    fetchSimilar,
    fetchByGenre,
} from "../utils/fetchData";
import {useFirebaseContext} from "./FirebaseContext";
import {MOVIE_GENRES, TV_GENRES} from "../types/constants";
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
        case "UPDATE_MOVIES_BY_GENRE":
            return {
                ...state,
                moviesByGenre: {
                    ...state.moviesByGenre,
                    [payload.name]: Array.isArray(payload.data) ? payload.data : [payload.data],
                },
            };
        case "UPDATE_TVSERIES_BY_GENRE":
            return {
                ...state,
                TVSeriesByGenre: {
                    ...state.TVSeriesByGenre,
                    [payload.name]: Array.isArray(payload.data) ? payload.data : [payload.data],
                },
            };
        default:
            return state;
    }
};

function DataContextProvider({children}: {children: ReactNode}) {
    const {currentProfile, account} = useFirebaseContext();
    const [localStoragePTWMovies, setLocalStoragePTWMovies] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-ptw-movies`,
        [] as EntryProps[]
    );
    const [localStoragePTWTVSeries, setLocalStoragePTWTVSeries] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-ptw-tvseries`,
        [] as EntryProps[]
    );
    const [localStorageFavoriteMovies, setLocalStorageFavoriteMovies] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-fav-movies`,
        [] as EntryProps[]
    );
    const [localStorageFavoriteTVSeries, setLocalStorageFavoriteTVSeries] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-fav-tvseries`,
        [] as EntryProps[]
    );

    const [dataState, dataDispatch] = useReducer(dataReducer, REDUCER_INITAL_STATE);

    const getByGenre = async (type: "tv" | "movie", genres: number[]): Promise<boolean> => {
        let response = await fetchByGenre(type, genres[0]);
        if (!response) return false;
        let genre = type === "movie" ? MOVIE_GENRES[genres[0]] : TV_GENRES[genres[0]];
        let dispatchType = type === "movie" ? "UPDATE_MOVIES_BY_GENRE" : ("UPDATE_TVSERIES_BY_GENRE" as DataReducerActionTypes);
        dataDispatch({type: dispatchType, payload: {name: genre, data: response}});

        response = await fetchByGenre(type, genres[1]);
        if (!response) return false;
        genre = type === "movie" ? MOVIE_GENRES[genres[1]] : TV_GENRES[genres[1]];
        dispatchType = type === "movie" ? "UPDATE_MOVIES_BY_GENRE" : ("UPDATE_TVSERIES_BY_GENRE" as DataReducerActionTypes);
        dataDispatch({type: dispatchType, payload: {name: genre, data: response}});
        return true;
    };

    const getMovieInformation = async (id: number): Promise<false | MovieInformation> => {
        const response = await fetchMovieInformation(id);
        if (!response) return false;
        return response;
    };

    const getTVSeriesInformation = async (id: number): Promise<false | TVSeriesInformation> => {
        const response = await fetchTVSeriesInformation(id);
        if (!response) return false;
        return response;
    };
    const getMovieCredits = async (id: number): Promise<false | MovieCredits> => {
        const response = await fetchMovieCredits(id);
        if (!response) return false;
        return response;
    };

    const getMovieDetails = async (id: number): Promise<false | MovieDetails> => {
        const response = await fetchMovieDetails(id);
        if (!response) return false;
        return response;
    };
    const getSimilar = async (entry: EntryProps): Promise<false | EntryProps[]> => {
        const response = await fetchSimilar(entry);
        if (!response) return false;
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
                getMovieCredits,
                getMovieDetails,
                getSimilar,
                getMovieInformation,
                getByGenre,
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
// const getTrailer = async (type: EntryTypes, id: number): Promise<false | string> => {
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

// const getLogo = async (type: EntryTypes, id: number): Promise<false | string> => {
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
