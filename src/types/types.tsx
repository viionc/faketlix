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
    createProfile: (name: string, profileColor: string) => void;
    manageProfiles: boolean;
    setManageProfiles: React.Dispatch<React.SetStateAction<boolean>>;
    updateProfile: (profileClicked: UserProfile, name: string, profileColor: string, autoplay: boolean) => void;
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
    modalState: ModalReducerState;
    openModal: (name: ModalActionNames, payload?: ModalActionPayload) => void;
    closeModal: (name: ModalActionNames, payload?: ModalActionPayload) => void;
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
    profileColor: string;
    autoplay: boolean;
};

export type UserAccount = {
    id: string;
    profiles: UserProfile[];
};

export type ModalReducerState = {
    isMovieModalOpen: boolean;
    movieClicked: MovieProps | null;
    isCreateProfileModalOpen: boolean;
    isManageProfilesModalOpen: boolean;
    profileCliked: UserProfile | null;
};

export type ModalAction = {
    type: "OPEN_MODAL" | "CLOSE_MODAL";
    name: ModalActionNames;
    payload?: ModalActionPayload;
};

export type ModalActionPayload = {
    name: "movieClicked" | "profileCliked";
    value: MovieProps | UserProfile | null;
};
export type ModalActionNames = "isMovieModalOpen" | "isCreateProfileModalOpen" | "isManageProfilesModalOpen";
