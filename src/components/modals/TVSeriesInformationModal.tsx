import {EntryProps, TVSeriesInformation} from "../../types/types";
import {useModalContext} from "../../context/ModalContext";
import {IMAGE_ORIGINAL_PATH, MOVIE_GENRES} from "../../types/constants";
import {useEffect, useState} from "react";
import Spinner from "../Spinner";
import {motion} from "framer-motion";
import MovieCard from "../pages/movie/MovieCard";
import {useDataContext} from "../../context/DataContext";
import AddToPlanToWatchButton from "../buttons/AddToPlanToWatchButton";
import AddToFavoritesButton from "../buttons/AddToFavoritesButton";
import CloseModalButton from "../buttons/CloseModalButton";

function TVSeriesInformationModal({entry}: {entry: EntryProps}) {
    const {closeModal} = useModalContext();

    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [error] = useState<boolean>(false);
    const [TVSeriesInformation, setTVSeriesInformation] = useState<TVSeriesInformation | null>(null);
    const background =
        window.outerWidth > 1000 ? `url(${IMAGE_ORIGINAL_PATH}${entry.backdrop_path})` : `url(${IMAGE_ORIGINAL_PATH}${entry.poster_path})`;
    const {getSimilar, getTVSeriesInformation} = useDataContext();

    const fetchData = async () => {
        getTVSeriesInformation(entry.id)
            .then(response => {
                if (response) {
                    setTVSeriesInformation(response);
                }
            })
            .then(() => {
                getSimilar(entry).then(response => {
                    if (response) {
                        setTVSeriesInformation(prev => {
                            if (!prev) return prev;
                            return {...prev, similar: response};
                        });
                    }
                });
            })
            .then(() => setDataLoaded(true));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div
            className="w-full h-full top-0 left-0 fixed bg-black bg-opacity-25 flex items-center z-[20] justify-center"
            onClick={e => {
                e.stopPropagation();
                closeModal("isTVSeriesInformationModalOpen");
            }}
        >
            <div className="h-full mt-28 w-[85%] lg:w-3/4 2xl:w-1/2 overflow-x-hidden overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="w-full flex items-center justify-center h-[94vh] ">
                    <motion.div
                        className=" bg-[#181818] flex flex-col rounded-md relative overflow-auto h-full overflow-x-hidden"
                        initial={{scale: 0.8}}
                        animate={{scale: 1}}
                    >
                        <CloseModalButton modal={"isTVSeriesInformationModalOpen"}></CloseModalButton>
                        <div
                            className={`flex flex-col justify-end min-h-[80vh] bg-no-repeat`}
                            style={{background: `${background} no-repeat center`, backgroundSize: "cover"}}
                        >
                            <div className="flex flex-col gap-4 w-full h-[10rem]">
                                <img
                                    src={`${IMAGE_ORIGINAL_PATH}${TVSeriesInformation?.logoURL}`}
                                    alt={`${entry.title} logo`}
                                    className="ps-10 w-[10rem] lg:w-[14rem]"
                                ></img>
                                <div className="ps-10 w-full h-[3rem] flex gap-2">
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
                                    <AddToPlanToWatchButton entry={entry} size={"large"} />
                                    <AddToFavoritesButton entry={entry} size={"large"}></AddToFavoritesButton>
                                </div>
                            </div>
                        </div>
                        {dataLoaded ? (
                            <div className="px-4 lg:px-10 pt-5 flex-col gap-2 w-full">
                                <h1 className="mb-6 text-xl">{TVSeriesInformation?.title}</h1>
                                <div className="flex flex-col lg:flex-row lg:gap-2">
                                    {/* LEFT COLUMN */}
                                    <div className="flex-col lg:w-[60%]">
                                        <div className="text-md text-zinc-400 flex gap-2 items-center flex-wrap lg:flex-nowrap">
                                            <span className="text-lime-600 text-sm font-semibold">
                                                Votes: {Math.floor((entry.vote_average / 10) * 100)}%
                                            </span>
                                            <span>{TVSeriesInformation?.release_date}</span>
                                            <span className="border border-zinc-400 rounded-sm h-[1.5rem]">HD</span>
                                            <span className="h-[1.5rem] rounded-sm border border-zinc-400 ">
                                                {TVSeriesInformation?.adult ? "18+" : "13+"}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-md text-zinc-400">Seasons: {TVSeriesInformation?.number_of_seasons}</span>
                                            <span className="text-md text-zinc-400">Episodes: {TVSeriesInformation?.number_of_episodes}</span>
                                        </div>
                                        <div></div>
                                        <div className="mt-10">{entry.overview}</div>
                                    </div>
                                    {/* RIGHT COLUMN */}
                                    <div className="flex-col">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                                Cast:{" "}
                                                {TVSeriesInformation?.cast.map((person, i) => (
                                                    <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                        {person}
                                                    </span>
                                                ))}
                                            </span>
                                            <span className="flex gap-2 text-zinc-500 text-sm flex-wrap">
                                                Genres:{" "}
                                                {entry?.genre_ids.map(id => (
                                                    <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                        {MOVIE_GENRES[id]}
                                                    </span>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-10">
                                    <h2 className="text-2xl text-white">Similar TV Series:</h2>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {TVSeriesInformation?.similar.map(entry => {
                                            return <MovieCard key={entry.id} entry={entry}></MovieCard>;
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col mt-10 gap-1 pb-5">
                                    <h2 className="text-2xl">About {entry.title}</h2>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Director: <span className="text-white">{TVSeriesInformation?.director}</span>
                                    </span>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Cast:{" "}
                                        {TVSeriesInformation?.cast.map((person, i) => (
                                            <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                {person}
                                            </span>
                                        ))}
                                    </span>
                                    <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                        Genres:{" "}
                                        {entry?.genre_ids.map(id => (
                                            <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                {MOVIE_GENRES[id]}
                                            </span>
                                        ))}{" "}
                                    </span>
                                    <div>
                                        <span className="w-[2rem] h[1rem] text-xs border border-gray-100">
                                            {TVSeriesInformation?.adult ? "18+" : "13+"}
                                        </span>
                                        <span> Recommended for ages {TVSeriesInformation?.adult ? "18" : "13"} or up.</span>
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

export default TVSeriesInformationModal;
