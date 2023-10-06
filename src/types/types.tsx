export type FirebaseContextProps = {
    loginUser: (email: string, password: string) => void;
    registerUser: (email: string, password: string) => void;
    formTypeOpen: null | "LOGIN" | "REGISTER";
    setFormTypeOpen: React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER" | null>>;
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
    getTopRatedMovies: () => Promise<boolean>;
    getPopularMovies: () => Promise<boolean>;
    popularMovies: MovieProps[] | null;
};
