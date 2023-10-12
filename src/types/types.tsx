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
    addToPlanToWatch: (type: EntryTypes, id: number) => void;
    addToFavorites: (type: EntryTypes, id: number) => void;
    removeFromPlanToWatch: (type: EntryTypes, id: number) => void;
    removeFromFavorites: (type: EntryTypes, id: number) => void;
    createProfile: (name: string, profileColor: string) => void;
    loginWithGoogle: () => Promise<any>;
    manageProfiles: boolean;
    setManageProfiles: React.Dispatch<React.SetStateAction<boolean>>;
    updateProfile: (profileClicked: UserProfile, name: string, profileColor: string, autoplay: boolean) => void;
    error: string | null;
};

export type EntryProps = {
    type: EntryTypes;
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

export type EntryTypes = "movie" | "tv";

// export interface MovieInformationResponse extends Response {
//     credits: {cast: Array<{name: string}>; crew: Array<{known_for_department: string; name: string}>};
//     images: {logos: Array<{iso_639_1: string; file_path: string}>};
//     keywords: {keywords: Array<{name: string; id: number}>};
//     similar: {results: Array<EntryProps>};
//     videos: {results: Array<{key: string; type: string}>};
//     adult: boolean;
//     release_date: string;
//     runtime: number;
//     id: number;
//     genre_ids: number[];
//     backdrop_path: string;
//     title: string;
//     overview: string;
//     vote_average: number;
//     vote_count: number;
//     poster_path: string;
// }

export type MovieInformation = {
    type: "movie";
    cast: Array<string>;
    director: string;
    logoURL: string;
    keywords: Array<string>;
    similar: Array<EntryProps>;
    trailerURL: string;
    adult: boolean;
    release_date: string;
    runtime: string;
    id: number;
    genre_ids: number[];
    backdrop_path: string;
    title: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    poster_path: string;
};

export type TVSeriesInformation = {
    type: "tv";
    cast: Array<string>;
    director: string;
    logoURL: string;
    keywords: Array<string>;
    similar: Array<EntryProps>;
    trailerURL: string;
    adult: boolean;
    release_date: string;
    id: number;
    genre_ids: number[];
    backdrop_path: string;
    title: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    poster_path: string;
    number_of_episodes: number;
    number_of_seasons: number;
};

export type ModalContextProps = {
    modalState: ModalReducerState;
    openModal: (name: ModalActionNames, payload?: ModalActionPayload) => void;
    closeModal: (name: ModalActionNames, payload?: ModalActionPayload) => void;
};

export type DataContextProps = {
    dataState: DataReducerState;
    getMovieCredits: (id: number) => Promise<false | MovieCredits>;
    getMovieDetails: (id: number) => Promise<false | MovieDetails>;
    getSimilar: (entry: EntryProps) => Promise<false | EntryProps[]>;
    getMovieInformation: (id: number) => Promise<false | MovieInformation>;
    getTVSeriesInformation: (id: number) => Promise<false | TVSeriesInformation>;
    getByGenre: (type: EntryTypes, genres: number[]) => Promise<boolean>;
    getPlanToWatchData: () => Promise<boolean>;
    getFavoritesData: () => Promise<boolean>;
    dataDispatch: React.Dispatch<DataReducerAction>;
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
    planToWatch: {movieIds: number[]; tvIds: number[]};
    favoritedMovies: {movieIds: number[]; tvIds: number[]};
    profileColor: string;
    autoplay: boolean;
};

export type UserAccount = {
    id: string;
    profiles: UserProfile[];
};

export type ModalReducerState = {
    isMovieInformationModalOpen: boolean;
    isTVSeriesInformationModalOpen: boolean;
    movieClicked: EntryProps | null;
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
    value: EntryProps | UserProfile | null;
};
export type ModalActionNames =
    | "isMovieInformationModalOpen"
    | "isCreateProfileModalOpen"
    | "isManageProfilesModalOpen"
    | "isTVSeriesInformationModalOpen";

export type DataReducerState = {
    topRatedMovies: EntryProps[];
    featuredMovie: EntryProps | null;
    popularMovies: EntryProps[];
    planToWatchMovies: EntryProps[];
    favoritedMovies: EntryProps[];
    moviesByGenre: Record<string, EntryProps[]>;
    upcomingMovies: EntryProps[];
    trendingMoviesInPoland: EntryProps[];
    topRatedTVSeries: EntryProps[];
    featuredTVSeries: EntryProps | null;
    popularTVSeries: EntryProps[];
    planToWatchTVSeries: EntryProps[];
    favoritedTVSeries: EntryProps[];
    TVSeriesByGenre: Record<string, EntryProps[]>;
    upcomingTVSeries: EntryProps[];
    trendingTVSeriesInPoland: EntryProps[];
};
export type DataReducerAction = {
    type: DataReducerActionTypes;
    payload: DataReducerPayload;
};

export type DataReducerActionTypes = "UPDATE_MOVIES" | "UPDATE_TVSERIES_BY_GENRE" | "UPDATE_MOVIES_BY_GENRE";

export type DataReducerPayload = {
    name: string;
    data: EntryProps | EntryProps[];
};

export type RegisterReducerState = {
    email: string;
    password: string;
    confirmPassword: string;
    emailError: null | string;
    passwordError: null | string;
    confirmPasswordError: null | string;
};

export type RegisterReducerAction = {
    type: "INPUT" | "RESET";
    payload: RegisterReducerPayload;
};
export type RegisterReducerPayload = {
    name: keyof RegisterReducerState;
    value: string | null;
};
