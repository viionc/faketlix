import {EntryProps, TVSeriesInformation} from "../../types/types";
import {useModalContext} from "../../context/ModalContext";
import {IMAGE_ORIGINAL_PATH, TV_GENRES} from "../../types/constants";
import {useEffect, useRef, useState} from "react";
import Spinner from "../Spinner";
import {motion} from "framer-motion";
import MovieCard from "../pages/movie/MovieCard";
import AddToPlanToWatchButton from "../buttons/AddToPlanToWatchButton";
import AddToFavoritesButton from "../buttons/AddToFavoritesButton";
import CloseModalButton from "../buttons/CloseModalButton";
import {useClickOutside} from "../../hooks/useClickOutside";
import PlayButton from "../buttons/PlayButton";
import Logo from "../Logo";
import ReactDOM from "react-dom";
import {fetchSimilar, fetchTVSeriesInformation} from "../../utils/fetchData";

function TVSeriesInformationModal({entry}: {entry: EntryProps}) {
    const {closeModal} = useModalContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [TVSeriesInformation, setTVSeriesInformation] = useState<TVSeriesInformation | null>(null);
    const background =
        window.outerWidth > 1000 ? `url(${IMAGE_ORIGINAL_PATH}${entry.backdrop_path})` : `url(${IMAGE_ORIGINAL_PATH}${entry.poster_path})`;

    const fetchData = async () => {
        const info = await fetchTVSeriesInformation(entry.id);
        if (!info) {
            setError(true);
            return;
        }
        setTVSeriesInformation(info);
        setIsLoading(false);
        const similar = await fetchSimilar(entry);
        if (!similar) return;
        setTVSeriesInformation(prev => ({...(prev as TVSeriesInformation), similar}));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const ref = useRef(null);
    useClickOutside(ref, () => closeModal("isTVSeriesInformationModalOpen"));

    return ReactDOM.createPortal(
        <div className="w-full h-full top-0 left-0 fixed bg-black bg-opacity-25 flex items-center z-[20] justify-center">
            <motion.div
                initial={{scale: 0.8}}
                animate={{scale: 1}}
                ref={ref}
                className="h-full mt-28 w-[85%] lg:w-3/4 2xl:w-1/2 overflow-x-hidden overflow-hidden"
            >
                {TVSeriesInformation ? (
                    <div className="w-full flex items-center justify-center h-[94vh] ">
                        <div className="w-full bg-[#181818] flex flex-col rounded-md relative overflow-auto h-full overflow-x-hidden">
                            <CloseModalButton modal={"isTVSeriesInformationModalOpen"}></CloseModalButton>
                            <div
                                className={`flex flex-col justify-end min-h-[80vh] bg-no-repeat`}
                                style={{background: `${background} no-repeat center`, backgroundSize: "cover"}}
                            >
                                <div className="ps-10 flex flex-col gap-4 w-full h-[10rem]">
                                    <Logo path={TVSeriesInformation.logoURL} title={entry.title}></Logo>
                                    <div className="w-full h-[3rem] flex gap-2">
                                        <PlayButton></PlayButton>
                                        <AddToPlanToWatchButton entry={entry} size={"large"} />
                                        <AddToFavoritesButton entry={entry} size={"large"}></AddToFavoritesButton>
                                    </div>
                                </div>
                            </div>
                            {!isLoading ? (
                                <div className="px-4 lg:px-10 pt-5 flex-col gap-2 w-full">
                                    <h1 className="mb-6 text-xl">{TVSeriesInformation.title}</h1>
                                    <div className="flex flex-col lg:flex-row lg:gap-2">
                                        {/* LEFT COLUMN */}
                                        <div className="flex-col lg:w-[60%]">
                                            <div className="text-md text-zinc-400 flex gap-2 items-center flex-wrap lg:flex-nowrap">
                                                <span className="text-lime-600 text-sm font-semibold">
                                                    Votes: {Math.floor((entry.vote_average / 10) * 100)}%
                                                </span>
                                                <span>{TVSeriesInformation.release_date}</span>
                                                <span className="border border-zinc-400 rounded-sm h-[1.5rem]">HD</span>
                                                <span className="h-[1.5rem] rounded-sm border border-zinc-400 ">
                                                    {TVSeriesInformation.adult ? "18+" : "13+"}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-md text-zinc-400">Seasons: {TVSeriesInformation.number_of_seasons}</span>
                                                <span className="text-md text-zinc-400">Episodes: {TVSeriesInformation.number_of_episodes}</span>
                                            </div>
                                            <div></div>
                                            <div className="mt-10">{entry.overview}</div>
                                        </div>
                                        {/* RIGHT COLUMN */}
                                        <div className="flex-col">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                                    Cast:{" "}
                                                    {TVSeriesInformation.cast.map((person, i) => (
                                                        <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                            {person}
                                                        </span>
                                                    ))}
                                                </span>
                                                <span className="flex gap-2 text-zinc-500 text-sm flex-wrap">
                                                    Genres:{" "}
                                                    {entry.genre_ids.map(id => (
                                                        <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                            {TV_GENRES[id]}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-10">
                                        <h2 className="text-2xl text-white">Similar TV Series:</h2>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {TVSeriesInformation.similar.map(entry => {
                                                return <MovieCard key={entry.id} entry={entry}></MovieCard>;
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-10 gap-1 pb-5">
                                        <h2 className="text-2xl">About {entry.title}</h2>
                                        <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                            Director: <span className="text-white">{TVSeriesInformation.director}</span>
                                        </span>
                                        <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                            Cast:{" "}
                                            {TVSeriesInformation.cast.map((person, i) => (
                                                <span key={i} className="text-white after:content-[','] last:after:content-['']">
                                                    {person}
                                                </span>
                                            ))}
                                        </span>
                                        <span className="flex gap-x-2 text-zinc-500 text-sm flex-wrap">
                                            Genres:{" "}
                                            {entry.genre_ids.map(id => (
                                                <span key={id} className="text-white after:content-[','] last:after:content-['']">
                                                    {TV_GENRES[id]}
                                                </span>
                                            ))}{" "}
                                        </span>
                                        <div>
                                            <span className="w-[2rem] h[1rem] text-xs border border-gray-100">
                                                {TVSeriesInformation.adult ? "18+" : "13+"}
                                            </span>
                                            <span> Recommended for ages {TVSeriesInformation.adult ? "18" : "13"} or up.</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[20rem] w-full flex items-center justify-center">
                                    <Spinner></Spinner>
                                </div>
                            )}
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-[20rem] w-full flex items-center justify-center">Failed loading data. Try again later.</div>
                ) : (
                    <Spinner />
                )}
            </motion.div>
        </div>,
        document.getElementById("portal") as HTMLElement
    );
}

export default TVSeriesInformationModal;
