import {useState} from "react";
import {MOVIE_GENRES} from "../../types/constants";
import {EntryProps} from "../../types/types";
import {useModalContext} from "../../context/ModalContext";
import AddToPlanToWatchButton from "../buttons/AddToPlanToWatchButton";
import AddToFavoritesButton from "../buttons/AddToFavoritesButton";

function CarouselCard({entry}: {entry: EntryProps}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const {openModal} = useModalContext();

    return (
        <div className="p-4 gap-2 hidden group-hover:flex flex-col w-full bg-[#181818] shadow-2xl rounded-b-md z-20">
            <p className="text-sm">{entry.title}</p>
            <div className="w-full h-[2rem] flex gap-2">
                <span className="h-[1.75rem] w-[1.75rem] bg-white rounded-full flex justify-center items-center hover:bg-opacity-50 cursor-pointer">
                    <i className="fa-solid fa-play" style={{color: "#000000"}}></i>
                </span>
                <AddToPlanToWatchButton entry={entry} size={"small"} />
                <AddToFavoritesButton entry={entry} size={"small"}></AddToFavoritesButton>

                <span
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() =>
                        openModal(entry.type === "movie" ? "isMovieInformationModalOpen" : "isTVSeriesInformationModalOpen", {
                            name: "movieClicked",
                            value: entry,
                        })
                    }
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
                <span className="text-lime-600 text-xs font-semibold">Votes: {Math.floor((entry.vote_average / 10) * 100)}%</span>
                <span className="bg-[#303030] border text-zinc-400 border-zinc-400 rounded-sm text-xs">{entry.adult ? "18+" : "13+"}</span>
                <span className="bg-[#303030] border text-zinc-400 border-zinc-400 rounded-sm text-xs">HD</span>
            </div>
            <div className="flex gap-2">
                {entry.genre_ids.map(id => {
                    return (
                        <span key={id} className="text-zinc-400 text-xs">
                            {MOVIE_GENRES[id]}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default CarouselCard;
