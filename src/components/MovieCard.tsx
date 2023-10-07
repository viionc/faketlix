import {MovieProps} from "../types/types";
import {IMAGE_SMALL_PATH} from "../types/constants";
import AddToPlanToWatchButton from "./AddToPlanToWatchButton";

function MovieCard({movie}: {movie: MovieProps}) {
    return (
        <div className="w-[16rem] flex flex-col gap-2">
            <img src={`${IMAGE_SMALL_PATH}${movie.backdrop_path}`} alt={`${movie.title} backdrop`}></img>
            <p className="text-sm">{movie.title}</p>
            <div className="flex gap-2 justify-between items-center">
                <span className="text-lime-600 text-sm font-semibold">Votes: {Math.floor((movie.vote_average / 10) * 100)}%</span>
                <AddToPlanToWatchButton movie={movie} size={"small"} />
            </div>
            <p className="text-xs text-ellipsis overflow-hidden h-[5rem]">{movie.overview}</p>
        </div>
    );
}

export default MovieCard;
