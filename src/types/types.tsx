import {User} from "firebase/auth";

export type FirebaseContextProps = {
    loginUser: (email: string, password: string) => void;
    registerUser: (email: string, password: string) => void;
    formTypeOpen: null | "LOGIN" | "REGISTER";
    setFormTypeOpen: React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER" | null>>;
    currentUser: User | null;
    logoutUser: () => void;
    currentProfile: UserProfile | null;
    account: UserAccount | null;
    changeUserProfile: (profileName: string) => void;
    addToPlanToWatch: (movie: MovieProps) => void;
    addToFavorites: (movie: MovieProps) => void;
    removeFromPlanToWatch: (movie: MovieProps) => void;
    removeFromFavorites: (movie: MovieProps) => void;
    createProfile: (name: string) => void;
};

export type MovieProps = {
    id: number;
    genre_ids: number[];
    backdrop_path: string;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    poster_path: string;
    adult: boolean;
};

export type ModalContextProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    movieClicked: MovieProps | null;
    setMovieClicked: React.Dispatch<React.SetStateAction<MovieProps | null>>;
    openModal: (movie: MovieProps) => void;
    closeModal: () => void;
};

export type DataContextProps = {
    topRatedMovies: MovieProps[] | null;
    featuredMovie: MovieProps | null;
    popularMovies: MovieProps[] | null;
    planToWatch: MovieProps[] | null;
    favoritedMovies: MovieProps[] | null;
    getTopRatedMovies: () => Promise<boolean>;
    getPopularMovies: () => Promise<boolean>;
    getMovieLogo: (movieId: number) => Promise<false | string>;
    getMovieCredits: (movieId: number) => Promise<false | MovieCredits>;
    getMovieDetails: (movieId: number) => Promise<false | MovieDetails>;
    getSimilarMovies: (movie: MovieProps) => Promise<false | MovieProps[]>;
    getMovieTrailer: (movieId: number) => Promise<false | string>;
    checkPlanToWatch: () => void;
    checkFavorites: () => void;
};

export type MovieCredits = {
    cast: Array<{name: string}>;
    director: string;
};

export type MovieDetails = {
    adult: boolean;
    release_date: string;
    runtime: string;
};

export type MovieTrailer = {
    key: string;
};

export type UserProfile = {
    name: string;
    planToWatch: number[];
    favoritedMovies: number[];
};

export type UserAccount = {
    id: string;
    profiles: UserProfile[];
};
