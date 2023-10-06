import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {DataContextProps, ModalContextProps, MovieProps} from "../types/types";
import {fetchPopularMovies, fetchTopRatedMovies} from "../utils/fetchData";

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

    const getTopRatedMovies = async (): Promise<boolean> => {
        const movies = await fetchTopRatedMovies();
        if (!movies) {
            return false;
        }
        setTopRatedMovies(movies);
        const number = Math.floor(Math.random() * movies.length);
        setFeaturedMovie(movies[number]);
        return true;
    };

    const getPopularMovies = async (): Promise<boolean> => {
        const movies = await fetchPopularMovies();
        if (!movies) {
            return false;
        }
        setPopularMovies(movies);
        return true;
    };

    return (
        <DataContext.Provider value={{getTopRatedMovies, topRatedMovies, featuredMovie, popularMovies, getPopularMovies}}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContextProvider;
