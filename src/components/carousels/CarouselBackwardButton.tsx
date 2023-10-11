import {EntryProps} from "../../types/types";
import clsx from "clsx";
import {IMAGE_SMALL_PATH} from "../../types/constants";

function CarouselBackwardButton({
    currentPage,
    entries,
    callback,
    numberPerPage,
}: {
    currentPage: number;
    entries: EntryProps[][];
    callback: (add: boolean) => void;
    numberPerPage: number;
}) {
    return (
        <div
            className={clsx(
                "h-full w-[2rem] flex justify-center items-center hover:brightness-75 cursor-pointer z-[15] brightness-50 rounded-e-md",
                currentPage > 0 ? "visible" : "invisible"
            )}
            onClick={() => callback(false)}
            style={{
                backgroundImage: currentPage > 0 ? `url('${IMAGE_SMALL_PATH}${entries[currentPage - 1][numberPerPage - 1].backdrop_path}')` : "none",
            }}
        >
            <i className="fa-solid fa-chevron-left" style={{color: "#ffffff"}}></i>
        </div>
    );
}

export default CarouselBackwardButton;
