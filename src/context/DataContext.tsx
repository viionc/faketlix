import {ReactNode, createContext, useContext, useReducer} from "react";
import {DataContextProps, DataReducerAction, DataReducerState, EntryProps} from "../types/types";
import {fetchDataByIds, fetchByName} from "../utils/fetchData";
import {useFirebaseContext} from "./FirebaseContext";
import {useLocalStorage} from "../hooks/useLocalStorage";

const DataContext = createContext<DataContextProps | null>(null);

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Couldn't initialize Data Context.");
    return context;
};

const REDUCER_INITAL_STATE: DataReducerState = {
    planToWatchMovies: [],
    favoritedMovies: [],
    planToWatchTVSeries: [],
    favoritedTVSeries: [],

    searchedEntries: [],
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

    const getByName = async (query: string): Promise<false | EntryProps[]> => {
        const response = await fetchByName(query);
        if (!response) return false;
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "searchedEntries", data: response}});
        return response;
    };

    const getPlanToWatchData = async (): Promise<false | {movies: EntryProps[]; tvSeries: EntryProps[]}> => {
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

        const tvSeries = [] as EntryProps[];
        idsToFetch = [] as number[];
        currentProfile.planToWatch.tvIds.forEach(id => {
            const tv = localStoragePTWTVSeries.find(m => m.id === id);
            if (tv) {
                tvSeries.push(tv);
            } else {
                idsToFetch.push(id);
            }
        });
        response = await fetchDataByIds("tv", idsToFetch);
        if (response) {
            tvSeries.push(...(response as EntryProps[]));
            setLocalStoragePTWTVSeries(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "planToWatchTVSeries", data: tvSeries}});

        return {movies, tvSeries};
    };

    const getFavoritesData = async (): Promise<false | {movies: EntryProps[]; tvSeries: EntryProps[]}> => {
        if (!currentProfile) return false;
        const movies = [] as EntryProps[];
        let idsToFetch = [] as number[];
        console.log(localStorageFavoriteMovies);
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

        const tvSeries = [] as EntryProps[];
        idsToFetch = [] as number[];
        currentProfile.favoritedMovies.tvIds.forEach(id => {
            const tv = localStorageFavoriteTVSeries.find(m => m.id === id);
            if (tv) {
                tvSeries.push(tv);
            } else {
                idsToFetch.push(id);
            }
        });
        response = await fetchDataByIds("tv", idsToFetch);
        if (response) {
            tvSeries.push(...(response as EntryProps[]));
            setLocalStorageFavoriteTVSeries(prev => [...prev, ...(response as EntryProps[])]);
        }
        dataDispatch({type: "UPDATE_MOVIES", payload: {name: "favoritedTVSeries", data: tvSeries}});

        return {movies, tvSeries};
    };

    return (
        <DataContext.Provider
            value={{
                dataState,
                getPlanToWatchData,
                getFavoritesData,
                getByName,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
export default DataContextProvider;
