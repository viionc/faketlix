import {EntryProps} from "../../../types/types";
import {IMAGE_SMALL_PATH} from "../../../types/constants";
import AddToPlanToWatchButton from "../../buttons/AddToPlanToWatchButton";

function MovieCard({entry}: {entry: EntryProps}) {
    return (
        <div className="w-[16rem] flex flex-col gap-2">
            <img src={`${IMAGE_SMALL_PATH}${entry.backdrop_path}`} alt={`${entry.title} backdrop`}></img>
            <p className="text-sm">{entry.title}</p>
            <div className="flex gap-2 justify-between items-center">
                <span className="text-lime-600 text-sm font-semibold">Votes: {Math.floor((entry.vote_average / 10) * 100)}%</span>
                <AddToPlanToWatchButton entry={entry} size={"small"} />
            </div>
            <p className="text-xs text-ellipsis overflow-hidden h-[5rem]">{entry.overview}</p>
        </div>
    );
}

export default MovieCard;
