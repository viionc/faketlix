import {MovieProps} from "../types/types";
import {useModalContext} from "../context/ModalContext";
import {IMAGE_ORIGINAL_PATH, MovieGenres} from "../types/constants";
import {useEffect, useState} from "react";
import Spinner from "./Spinner";
import {motion} from "framer-motion";
import MovieCard from "./MovieCard";

interface LogoResponse extends Response {
    logos: Array<Logo>;
}
interface CreditsResponse extends Response {
    crew: Array<{known_for_department: string; name: string}>;
    cast: Array<{name: string}>;
}

interface DetailsResponse extends Response {
    adult: boolean;
    release_date: string;
    runtime: number;
}
interface SimilarMoviesResponse extends Response {
    results: Array<MovieProps>;
}
interface Logo {
    iso_639_1: string;
    file_path: string;
}
type MovieCredits = {
    cast: Array<{name: string}>;
    director: string;
};
type MovieDetails = {
    adult: boolean;
    release_date: string;
    runtime: string;
};

function MovieInformationModal({movie}: {movie: MovieProps}) {
    const {closeModal} = useModalContext();
    const [movieLogo, setMovieLogo] = useState<string | null>();
    const [movieCredits, setMovieCredits] = useState<MovieCredits | null>(null);
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [similarMovies, setSimilarMovies] = useState<MovieProps[] | null>(null);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getMovieInformation = async () => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_ACCESS_TOKEN}`,
            },
        };
        // logo
        let logoResponse = {} as LogoResponse;
        try {
            logoResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/images`, options)) as LogoResponse;
            if (logoResponse.status !== 200) {
                setError(true);
                return;
            }
            logoResponse = await logoResponse.json();
        } catch (err) {
            console.error(err);
            setError(true);
            return;
        }

        const englishLogo = logoResponse.logos.find(logo => logo.iso_639_1 === "en");
        englishLogo ? setMovieLogo(englishLogo.file_path) : setMovieLogo(logoResponse.logos[0].file_path);

        // credits
        let creditsResponse = {} as CreditsResponse;
        try {
            creditsResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, options)) as CreditsResponse;
            if (creditsResponse.status !== 200) {
                setError(true);
                return;
            }
            creditsResponse = await creditsResponse.json();
        } catch (err) {
            console.error(err);
            setError(true);
            return;
        }

        const cast = creditsResponse.cast.slice(0, 4);
        let director = creditsResponse.crew.find(crew => crew.known_for_department === "Directing")?.name;
        if (!director) director = "Unknown";
        setMovieCredits({cast, director});

        //details
        let detailsResponse = {} as DetailsResponse;
        try {
            detailsResponse = (await fetch(`https://api.themoviedb.org/3/movie/${movie.id}`, options)) as DetailsResponse;
            if (detailsResponse.status !== 200) {
                setError(true);
                return;
            }
            detailsResponse = await detailsResponse.json();
        } catch (err) {
            console.error(err);
            setError(true);
            return;
        }

        const hours = Math.floor(detailsResponse.runtime / 60);
        const minutes = Math.floor(detailsResponse.runtime % 60);
        const runtime = `${hours ? hours + "h " : null}${minutes}m`;
        setMovieDetails({
            adult: detailsResponse.adult,
            release_date: detailsResponse.release_date.split("-")[0],
            runtime,
        });

        let similarMoviesResponse = {} as SimilarMoviesResponse;
        try {
            similarMoviesResponse = (await fetch(
                `https://api.themoviedb.org/3/discover/movie?with_genres=${movie.genre_ids.join(",")}`,
                options
            )) as SimilarMoviesResponse;

            if (similarMoviesResponse.status !== 200) {
                setError(true);
                return;
            }
            similarMoviesResponse = await similarMoviesResponse.json();
        } catch (err) {
            console.error(err);
            setError(true);
            return;
        }
        const movies = similarMoviesResponse.results
            .filter(m => m.id !== movie.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 9);
        setSimilarMovies(movies);
        setDataLoaded(true);
    };

    useEffect(() => {
        getMovieInformation();
    }, []);

    return (
        <div
            className="w-full h-full top-0 left-0 fixed bg-black bg-opacity-25 flex items-center z-10 justify-center"
            onClick={e => {
                e.stopPropagation();
                closeModal();
            }}
        >
            <div className="h-full mt-28 w-1/2 overflow-x-hidden overflow-hidden z-30" onClick={e => e.stopPropagation()}>
                <div className="w-full flex items-center justify-center z-30 h-[94vh] ">
                    <motion.div
                        className=" bg-[#181818] flex flex-col rounded-md relative z-30 overflow-auto h-full overflow-x-hidden"
                        initial={{scale: 0.8}}
                        animate={{scale: 1}}
                    >
                        <button
                            type="button"
                            className="z-30 bg-gray-800 absolute top-2 right-2 cursor-pointer rounded-full border-2 border-white p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={closeModal}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg
                                className="h-6 w-6 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                                        <span className="h-[3rem] w-[3rem] bg-[#303030] border-2 border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-8 h-8"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </span>
                                        <span className="h-[3rem] w-[3rem] bg-[#303030] border-2 border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                                                />
                                            </svg>
                                        </span>
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
                                            return <MovieCard movie={movie}></MovieCard>;
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
