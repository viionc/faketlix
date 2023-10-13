import clsx from "clsx";
import {useEffect, useState} from "react";
import CarouselCard from "./CarouselCard";
import {IMAGE_SMALL_PATH} from "../../types/constants";
import {EntryProps} from "../../types/types";
import CarouselForwardButton from "./CarouselForwardButton";
import CarouselBackwardButton from "./CarouselBackwardButton";

function Carousel({entries, title}: {entries: EntryProps[]; title: string}) {
    const [splitEntries, setSplitEntries] = useState<Array<Array<EntryProps>>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const [numberPerPage] = useState<number>(Math.floor((window.outerWidth - 64) / 304));
    // const numberPerPage = Math.floor((window.outerWidth - 64) / 304);

    useEffect(() => {
        const result: Array<Array<EntryProps>> = [];
        for (let i = 0; i < entries.length; i += numberPerPage) {
            const page = entries.slice(i, i + numberPerPage);
            result.push(page);
        }
        setSplitEntries(result);
        setLoaded(true);
    }, [entries, numberPerPage]);

    const handlePageChange = (add: boolean) => {
        if (add) {
            if (currentPage < entries.length / numberPerPage - 1) {
                setCurrentPage(prev => (prev += 1));
            }
        } else {
            if (currentPage > 0) {
                setCurrentPage(prev => (prev -= 1));
            }
        }
    };
    let startingPosition = 0;

    const handleTouch = (e: React.TouchEvent<HTMLElement>, start: boolean) => {
        changePage(e.changedTouches[0].clientX, start);
    };
    const handleDrag = (e: React.DragEvent<HTMLElement>, start: boolean) => {
        changePage(e.clientX, start);
    };
    const changePage = (clientX: number, start: boolean) => {
        if (start) {
            startingPosition = clientX;
            return;
        }
        if (clientX > startingPosition) {
            if (currentPage === 0) return;
            setCurrentPage(prev => prev - 1);
        }
        if (clientX < startingPosition) {
            if (currentPage === splitEntries.length - 1) return;
            setCurrentPage(prev => prev + 1);
        }
        startingPosition = 0;
    };

    return (
        <section
            className="w-full flex flex-col"
            onDragStart={e => handleDrag(e, true)}
            onDragEnd={e => handleDrag(e, false)}
            onTouchStart={e => handleTouch(e, true)}
            onTouchEnd={e => handleTouch(e, false)}
            draggable="true"
        >
            <div className="py-3 pt-6 text-3xl ps-9 font-semibold">{title}</div>
            <div className="flex gap-1 relative h-[10rem] justify-center sm:justify-normal">
                <CarouselBackwardButton
                    callback={handlePageChange}
                    entries={splitEntries}
                    currentPage={currentPage}
                    numberPerPage={numberPerPage}
                ></CarouselBackwardButton>
                {loaded &&
                    splitEntries[currentPage].map((entry, i) => {
                        const position = i === 0 ? "left-0 md:group-hover:left-[50px]" : i === numberPerPage - 1 ? "group-hover:left-[-50px]" : "";
                        const movieIndex = entries.findIndex(m => m.id === entry.id);
                        const image = entry.backdrop_path ? `${IMAGE_SMALL_PATH}${entry.backdrop_path}` : "noimage.png";
                        return (
                            <div
                                onMouseOver={() => setInfoTooltipId(entry.id)}
                                onMouseLeave={() => setInfoTooltipId(null)}
                                key={entry.id}
                                className="group hover:scale-125 md:hover:scale-150 transition w-[19rem] relative hover:z-[10] duration-500"
                            >
                                <div
                                    className={clsx("absolute top-0 left-0 w-[19rem] group-hover:top-[-50px] transition-all duration-500 ", position)}
                                >
                                    {!title.includes("Top 10") ? (
                                        <img
                                            src={`${image}`}
                                            className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"
                                        ></img>
                                    ) : (
                                        <>
                                            <div className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none relative visible group-hover:hidden">
                                                <img
                                                    className={clsx(`absolute top-0`, movieIndex + 1 === 10 ? "left-[10%]" : "left-[30%]")}
                                                    src={`/numbers/${movieIndex + 1}.png`}
                                                ></img>
                                                <img
                                                    className="absolute h-[10rem] w-[8rem] top-0 left-[55%] "
                                                    src={`${IMAGE_SMALL_PATH}${entry.poster_path}`}
                                                ></img>
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
                    })}
                <CarouselForwardButton callback={handlePageChange} entries={splitEntries} currentPage={currentPage}></CarouselForwardButton>
            </div>
        </section>
    );
}

export default Carousel;
