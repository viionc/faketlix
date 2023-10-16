import clsx from "clsx";
import {useState} from "react";
import {IMAGE_SMALL_PATH} from "../../types/constants";
import {CarouselTileProps} from "../../types/types";
import CarouselCard from "./CarouselCard";

function CarouselTile({entry, title, numberPerPage, width, index, movieIndex}: CarouselTileProps) {
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const image = entry.backdrop_path ? `${IMAGE_SMALL_PATH}${entry.backdrop_path}` : "noimage.png";
    const tileWidth = width < 1024 ? `${80 / numberPerPage}%` : `${92.7 / numberPerPage}%`;
    const position = index === 0 ? "left-0 md:group-hover:left-[50px]" : index === numberPerPage - 1 ? "left-0 md:group-hover:left-[-50px]" : "";

    return (
        <div
            onMouseOver={() => setInfoTooltipId(entry.id)}
            onMouseLeave={() => setInfoTooltipId(null)}
            key={entry.id}
            className={`group hover:scale-125 md:hover:scale-150  transition relative hover:z-[100] duration-500`}
            style={{width: tileWidth}}
        >
            <div className={clsx("absolute top-0 group-hover:top-[-50px] group-hover:z-[1000] transition-all duration-500 w-full", position)}>
                {!title.includes("Top 10") ? (
                    <img src={`${image}`} className="rounded-md max-h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none w-full"></img>
                ) : (
                    <>
                        <div className="rounded-md max-h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none relative visible group-hover:hidden">
                            <img
                                className={clsx(`absolute top-0`, movieIndex + 1 === 10 ? "left-[10%]" : "left-[30%]")}
                                src={`/numbers/${movieIndex + 1}.png`}
                            ></img>
                            <img
                                className="absolute max-h-[10rem] top-0 left-[55%] w-[45%] rounded-e-md"
                                src={`${IMAGE_SMALL_PATH}${entry.poster_path}`}
                            ></img>
                        </div>
                        <img
                            src={`${image}`}
                            className="rounded-md group-hover:rounded-t-md group-hover:rounded-b-none hidden group-hover:block"
                        ></img>
                    </>
                )}
                {infoTooltipId === entry.id && <CarouselCard entry={entry}></CarouselCard>}
            </div>
        </div>
    );
}

export default CarouselTile;
