import clsx from "clsx";
import {useState} from "react";
import {IMAGE_SMALL_PATH} from "../../types/constants";
import {EntryProps} from "../../types/types";
import CarouselCard from "./CarouselCard";

function CarouselTile({entry, title, movieIndex, position}: {entry: EntryProps; title: string; movieIndex: number; position: string}) {
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const image = entry.backdrop_path ? `${IMAGE_SMALL_PATH}${entry.backdrop_path}` : "noimage.png";

    return (
        <div
            onMouseOver={() => setInfoTooltipId(entry.id)}
            onMouseLeave={() => setInfoTooltipId(null)}
            key={entry.id}
            className="group hover:scale-125 md:hover:scale-150 transition w-[19rem] relative h-[10rem] hover:z-[10] duration-500"
        >
            <div className={clsx("absolute top-0 left-0 w-[19rem] group-hover:top-[-50px] transition-all duration-500 ", position)}>
                {!title.includes("Top 10") ? (
                    <img src={`${image}`} className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"></img>
                ) : (
                    <>
                        <div className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none relative visible group-hover:hidden">
                            <img
                                className={clsx(`absolute top-0`, movieIndex + 1 === 10 ? "left-[10%]" : "left-[30%]")}
                                src={`/numbers/${movieIndex + 1}.png`}
                            ></img>
                            <img className="absolute h-[10rem] w-[8rem] top-0 left-[55%] " src={`${IMAGE_SMALL_PATH}${entry.poster_path}`}></img>
                        </div>
                        <img
                            src={`${image}`}
                            className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none hidden group-hover:block"
                        ></img>
                    </>
                )}
                {infoTooltipId === entry.id && <CarouselCard entry={entry}></CarouselCard>}
            </div>
        </div>
    );
}

export default CarouselTile;
