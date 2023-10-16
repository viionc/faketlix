import clsx from "clsx";
import {useState} from "react";
import {SearchTileProps} from "../../../types/types";
import {IMAGE_SMALL_PATH} from "../../../types/constants";
import CarouselCard from "../../carousels/CarouselCard";

function SearchTile({entry, numberPerPage, width, index}: SearchTileProps) {
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const image = entry.backdrop_path ? `${IMAGE_SMALL_PATH}${entry.backdrop_path}` : "noimage.png";
    const tileWidth = width < 1024 ? `${80 / numberPerPage}%` : `${92.7 / numberPerPage}%`;
    let position =
        (index + 1 !== 1 && (index + 1) % numberPerPage === 1) || index === 0
            ? "left-0 md:group-hover:left-[50px]"
            : index !== 0 && (index + 1) % numberPerPage === 0
            ? "left-0 md:group-hover:left-[-50px]"
            : "";
    position = numberPerPage === 1 ? "left-0" : position;
    return (
        <div
            onMouseOver={() => setInfoTooltipId(entry.id)}
            onMouseLeave={() => setInfoTooltipId(null)}
            key={entry.id}
            className={`group hover:scale-125 min-h-[10rem] md:hover:scale-150 transition relative hover:z-[100] duration-500`}
            style={{width: tileWidth}}
        >
            <div className={clsx("absolute top-0 group-hover:top-[-50px] group-hover:z-[1000] transition-all duration-500 w-full", position)}>
                <img src={`${image}`} className="rounded-md group-hover:rounded-t-md group-hover:rounded-b-none"></img>
                {infoTooltipId === entry.id && <CarouselCard entry={entry}></CarouselCard>}
            </div>
        </div>
    );
}

export default SearchTile;
