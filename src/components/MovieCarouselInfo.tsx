import {useState} from "react";
import {MovieGenres} from "../types/constants";
import {MovieProps} from "../types/types";
import {useModalContext} from "../context/ModalContext";
import AddToPlanToWatchButton from "./AddToPlanToWatchButton";
import AddToFavoritesButton from "./AddToFavoritesButton";

function MovieCarouselInfo({movie}: {movie: MovieProps}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const {openModal} = useModalContext();

    return (
        <div className="p-4 gap-2 hidden group-hover:flex flex-col w-full bg-[#181818] shadow-2xl rounded-b-md">
            <p className="text-sm">{movie.title}</p>
            <div className="w-full h-[2rem] flex gap-2">
                <span className="h-[1.75rem] w-[1.75rem] bg-white rounded-full flex justify-center items-center hover:bg-opacity-50 cursor-pointer">
                    <i className="fa-solid fa-play" style={{color: "#000000"}}></i>
                </span>
                <AddToPlanToWatchButton movie={movie} size={"small"} />
                <AddToFavoritesButton movie={movie} size={"small"}></AddToFavoritesButton>

                <span
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => openModal(movie)}
                    className="relative group ms-auto h-[1.75rem] w-[1.75rem] bg-[#303030] border border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span
                        className="text-black w-[9rem] p-2 hidden group-hover:flex bg-white rounded-md absolute top-[-3rem] left-1/2 translate-x-[-50%] justify-center"
                        style={{display: showTooltip ? "flex" : "none"}}
                    >
                        Episodes & Info
                    </span>
                </span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-lime-600 text-xs font-semibold">Votes: {Math.floor((movie.vote_average / 10) * 100)}%</span>
                <span className="bg-[#303030] border text-zinc-400 border-zinc-400 rounded-sm text-xs">{movie.adult ? "18+" : "13+"}</span>
                <span className="bg-[#303030] border text-zinc-400 border-zinc-400 rounded-sm text-xs">HD</span>
            </div>
            <div className="flex gap-2">
                {movie.genre_ids.map(id => {
                    return (
                        <span key={id} className="text-zinc-400 text-xs">
                            {MovieGenres[id.toString()]}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default MovieCarouselInfo;
