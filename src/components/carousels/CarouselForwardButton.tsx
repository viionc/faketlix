import {EntryProps} from "../../types/types";
import clsx from "clsx";

function CarouselForwardButton({currentPage, entries, callback}: {currentPage: number; entries: EntryProps[][]; callback: (add: boolean) => void}) {
    return (
        <div
            className={clsx(
                "w-[10%] lg:w-[3%] absolute top-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 hover:bg-opacity-70 cursor-pointer z-[15] rounded-s-md",
                currentPage < entries.length - 1 ? "visible" : "invisible"
            )}
            onClick={() => callback(true)}
        >
            <i className="fa-solid fa-chevron-right" style={{color: "#ffffff"}}></i>
        </div>
    );
}

export default CarouselForwardButton;
