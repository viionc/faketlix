import clsx from "clsx";
import {useEffect, useState} from "react";
import CarouselCard from "./CarouselCard";
import {IMAGE_SMALL_PATH, MOVIE_GENRES, TV_GENRES} from "../../types/constants";
import {DataReducerState, EntryProps, EntryTypes} from "../../types/types";
import CarouselForwardButton from "./CarouselForwardButton";
import CarouselBackwardButton from "./CarouselBackwardButton";
import {useDataContext} from "../../context/DataContext";
import CarouselPlaceholder from "./CarouselPlaceholder";

function Carousel({propKey, type, title}: {type: EntryTypes; propKey: keyof DataReducerState; title: string}) {
    const [splitEntries, setSplitEntries] = useState<Array<Array<EntryProps>>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const [numberPerPage] = useState<number>(Math.floor((window.outerWidth - 64) / 304));
    const [error, setError] = useState<boolean>(false);
    const [length, setLength] = useState<number>(6);

    const {
        dataState,
        getTopRatedMovies,
        getUpcomingMovies,
        getPopularMovies,
        getTrendingMoviesInPoland,
        getByGenre,
        getTrendingTVSeriesInPoland,
        getTopRatedTVSeries,
        getUpcomingTVSeries,
        getPopularTVSeries,
        getPlanToWatchData,
        getFavoritesData,
    } = useDataContext();
    // const numberPerPage = Math.floor((window.outerWidth - 64) / 304);
    const fetchData = async (propKey: keyof DataReducerState, type: EntryTypes): Promise<void> => {
        let response;
        let genreIndex;
        switch (propKey) {
            case "topRatedMovies":
                response = await getTopRatedMovies();
                break;
            case "upcomingMovies":
                response = await getUpcomingMovies();
                break;
            case "popularMovies":
                response = await getPopularMovies();
                break;
            case "trendingMoviesInPoland":
                response = await getTrendingMoviesInPoland();
                break;
            case "topRatedTVSeries":
                response = await getTopRatedTVSeries();
                break;
            case "upcomingTVSeries":
                response = await getUpcomingTVSeries();
                break;
            case "popularTVSeries":
                response = await getPopularTVSeries();
                break;
            case "trendingTVSeriesInPoland":
                response = await getTrendingTVSeriesInPoland();
                break;
            case "planToWatchMovies":
            case "planToWatchTVSeries":
                response = await getPlanToWatchData();
                break;
            case "favoritedMovies":
            case "favoritedTVSeries":
                response = await getFavoritesData();
                break;
            default:
                // eslint-disable-next-line no-case-declarations
                genreIndex =
                    type === "movie"
                        ? Object.keys(MOVIE_GENRES).find(key => MOVIE_GENRES[parseInt(key)] === title)
                        : Object.keys(TV_GENRES).find(key => TV_GENRES[parseInt(key)] === title);
                response = await getByGenre(type, parseInt(genreIndex as string));
                break;
        }
        if (!response) {
            setError(true);
            setIsLoading(false);
            return;
        }
    };

    useEffect(() => {
        fetchData(propKey, type);
    }, [propKey, type]);

    useEffect(() => {
        if (dataState === null || dataState[propKey] === null) return;
        const result: Array<Array<EntryProps>> = [];
        let entries = [];
        if (Array.isArray(dataState[propKey])) {
            entries = dataState[propKey] as Array<EntryProps>;
        } else {
            entries = type === "movie" ? dataState.moviesByGenre[title] : dataState.TVSeriesByGenre[title];
        }
        if (!entries || !entries.length) return;
        setLength(entries.length);
        for (let i = 0; i < entries.length; i += numberPerPage) {
            const page = entries.slice(i, i + numberPerPage);
            result.push(page);
        }
        setSplitEntries(result);
        setTimeout(() => {
            setIsLoading(false);
            setError(false);
        }, 500);
    }, [numberPerPage, dataState, type, propKey, title]);

    const handlePageChange = (add: boolean) => {
        if (add) {
            if (currentPage < length / numberPerPage - 1) {
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
    if (error) {
        return <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading {title}. Try again later.</div>;
    }
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
                {!isLoading ? (
                    splitEntries[currentPage].map((entry, i) => {
                        const position = i === 0 ? "left-0 md:group-hover:left-[50px]" : i === numberPerPage - 1 ? "group-hover:left-[-50px]" : "";
                        const movieIndex = currentPage * numberPerPage + i;
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
                    })
                ) : (
                    <CarouselPlaceholder></CarouselPlaceholder>
                )}
                <CarouselForwardButton callback={handlePageChange} entries={splitEntries} currentPage={currentPage}></CarouselForwardButton>
            </div>
        </section>
    );
}

export default Carousel;
