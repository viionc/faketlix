import {EntryProps} from "../../types/types";
import clsx from "clsx";
import {IMAGE_SMALL_PATH} from "../../types/constants";

function CarouselForwardButton({currentPage, entries, callback}: {currentPage: number; entries: EntryProps[][]; callback: (add: boolean) => void}) {
    return (
        <div
            className={clsx(
                "h-full w-[2rem] flex justify-center items-center hover:bg-black hover:bg-opacity-30 cursor-pointer z-[15] rounded-s-md",
                currentPage < entries.length - 1 ? "visible" : "invisible"
            )}
            style={{
                backgroundImage: currentPage < entries.length - 1 ? `url('${IMAGE_SMALL_PATH}${entries[currentPage + 1][0].backdrop_path}')` : "none",
            }}
            onClick={() => callback(true)}
        >
            <i className="fa-solid fa-chevron-right" style={{color: "#ffffff"}}></i>
        </div>
    );
}

export default CarouselForwardButton;
