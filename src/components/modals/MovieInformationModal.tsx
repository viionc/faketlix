import {MovieCredits, MovieDetails, MovieProps} from "../../types/types";
import {useModalContext} from "../../context/ModalContext";
import {IMAGE_ORIGINAL_PATH, MovieGenres} from "../../types/constants";
import {useEffect, useState} from "react";
import Spinner from "../Spinner";
import {motion} from "framer-motion";
import MovieCard from "../MovieCard";
import {useDataContext} from "../../context/DataContext";
import AddToPlanToWatchButton from "../buttons/AddToPlanToWatchButton";
import AddToFavoritesButton from "../buttons/AddToFavoritesButton";
import CloseModalButton from "../buttons/CloseModalButton";

function MovieInformationModal({movie}: {movie: MovieProps}) {
    const {closeModal} = useModalContext();
    const [movieLogo, setMovieLogo] = useState<string | null>();
    const [movieCredits, setMovieCredits] = useState<MovieCredits | null>(null);
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [similarMovies, setSimilarMovies] = useState<MovieProps[] | null>(null);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [error] = useState<boolean>(false);

    const {getMovieLogo, getMovieCredits, getMovieDetails, getSimilarMovies} = useDataContext();

    const getMovieInformation = async () => {
        // logo
        getMovieLogo(movie.id).then(response => {
            if (response) {
                setMovieLogo(response);
            }
        });

        getMovieCredits(movie.id).then(response => {
            if (response) {
                setMovieCredits(response);
            }
        });
        getMovieDetails(movie.id).then(response => {
            if (response) {
                setMovieDetails(response);
            }
        });
        getSimilarMovies(movie)
            .then(response => {
                if (response) {
                    setSimilarMovies(response);
                }
            })
            .then(() => setDataLoaded(true));
    };

    useEffect(() => {
        getMovieInformation();
    }, []);

    return (
        <div
            className="w-full h-full top-0 left-0 fixed bg-black bg-opacity-25 flex items-center z-10 justify-center"
            onClick={e => {
                e.stopPropagation();
                closeModal("isMovieModalOpen");
            }}
        >
            <div className="h-full mt-28 w-1/2 overflow-x-hidden overflow-hidden z-30" onClick={e => e.stopPropagation()}>
                <div className="w-full flex items-center justify-center z-30 h-[94vh] ">
                    <motion.div
                        className=" bg-[#181818] flex flex-col rounded-md relative z-30 overflow-auto h-full overflow-x-hidden"
                        initial={{scale: 0.8}}
                        animate={{scale: 1}}
                    >
                        <CloseModalButton modal={"isMovieModalOpen"}></CloseModalButton>
                        <div className="relative h-[36rem]">
                            <img
                                src={`${IMAGE_ORIGINAL_PATH}${movie.backdrop_path}`}
                                className="rounded-t-md h-[36rem]"
                                alt={`${movie.title} image`}
                            ></img>
                            <div className="absolute top-[60%] left-10 flex flex-col w-full">
                                <div>
                                    <img src={`${IMAGE_ORIGINAL_PATH}${movieLogo}`} alt={`${movie.title} logo`} className="w-[14rem] "></img>
                                    <div className="ps-10 mt-4 w-full h-[3rem] flex gap-2">
                                        <span className="py-1 px-8 bg-white rounded-md flex gap-2 justify-center items-center hover:bg-opacity-50 cursor-pointer text-black font-semibold text-xl">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="black"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-8 h-8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                                />
                                            </svg>
                                            Play
                                        </span>
                                        <AddToPlanToWatchButton movie={movie} size={"large"} />
                                        <AddToFavoritesButton movie={movie} size={"large"}></AddToFavoritesButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {dataLoaded ? (
                            <div className="px-10 pt-5 flex-col gap-2 w-full">
                                <div className="flex gap-2">
                                    {/* LEFT COLUMN */}
                                    <div className="flex-col w-[60%]">
                                        <div className="w-[60%] text-md text-zinc-400 flex gap-2 items-center">
                                            <span className="text-lime-600 text-sm font-semibold">
                                                Votes: {Math.floor((movie.vote_average / 10) * 100)}%
                                            </span>
                                            <span>{movieDetails?.release_date}</span>
                                            <span>{movieDetails?.runtime}</span>
                                            <span className="border border-zinc-400 rounded-sm h-[1.5rem]">HD</span>
                                        </div>

                                        <div>
                                            <span className="w-[2rem] h[1rem] text-xs border border-gray-100">
                                                {movieDetails?.adult ? "18+" : "13+"}
                                            </span>
                                        </div>
                                        <div className="mt-10">{movie.overview}</div>
                                    </div>
                                    {/* RIGHT COLUMN */}
                                    <div className="flex-col">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                                Cast:{" "}
                                                {movieCredits?.cast.map((person, i) => (
                                                    <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                        {person.name}
                                                    </span>
                                                ))}
                                            </span>
                                            <span className="flex gap-2 text-zinc-500 text-sm flex-wrap">
                                                Genres:{" "}
                                                {movie?.genre_ids.map(id => (
                                                    <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                        {MovieGenres[id]}
                                                    </span>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-10">
                                    <h2 className="text-2xl text-white">Similar Movies:</h2>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {similarMovies?.map(movie => {
                                            return <MovieCard key={movie.id} movie={movie}></MovieCard>;
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col mt-10 gap-1 pb-5">
                                    <h2 className="text-2xl">About {movie.title}</h2>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Director: <span className="text-white">{movieCredits?.director}</span>
                                    </span>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Cast:{" "}
                                        {movieCredits?.cast.map((person, i) => (
                                            <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                {person.name}
                                            </span>
                                        ))}
                                    </span>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Genres:{" "}
                                        {movie?.genre_ids.map(id => (
                                            <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                {MovieGenres[id]}
                                            </span>
                                        ))}{" "}
                                    </span>
                                    <div>
                                        <span className="w-[2rem] h[1rem] text-xs border border-gray-100">{movieDetails?.adult ? "18+" : "13+"}</span>
                                        <span> Recommended for ages {movieDetails?.adult ? "18" : "13"} or up.</span>
                                    </div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="h-[20rem] w-full flex items-center justify-center">Failed loading data. Try again later.</div>
                        ) : (
                            <div className="h-[20rem] w-full flex items-center justify-center">
                                <Spinner></Spinner>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default MovieInformationModal;
