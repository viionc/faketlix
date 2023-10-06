import {MovieProps} from "../types/types";
import {IMAGE_SMALL_PATH} from "../types/constants";

function MovieCard({movie}: {movie: MovieProps}) {
    return (
        <div className="w-[16rem] flex flex-col gap-2">
            <img src={`${IMAGE_SMALL_PATH}${movie.backdrop_path}`} alt={`${movie.title} backdrop`}></img>
            <div className="flex gap-2 justify-between items-center">
                <span className="text-lime-600 text-sm font-semibold">Votes: {Math.floor((movie.vote_average / 10) * 100)}%</span>
                <span className="h-[1.75rem] w-[1.75rem] bg-[#303030] border border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </span>
            </div>
            <p className="text-xs text-ellipsis overflow-hidden h-[5rem]">{movie.overview}</p>
        </div>
    );
}

export default MovieCard;
