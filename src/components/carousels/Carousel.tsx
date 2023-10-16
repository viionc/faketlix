import {useEffect, useState} from "react";
import {MOVIE_GENRES, TV_GENRES} from "../../types/constants";
import {DataReducerState, EntryProps, EntryTypes} from "../../types/types";
import CarouselForwardButton from "./CarouselForwardButton";
import CarouselBackwardButton from "./CarouselBackwardButton";
import {useDataContext} from "../../context/DataContext";
import CarouselPlaceholder from "./CarouselPlaceholder";
import CarouselTile from "./CarouselTile";
import clsx from "clsx";
import useWindowSize from "../../hooks/useWindowSize";

function Carousel({propKey, type, title}: {type: EntryTypes; propKey: keyof DataReducerState; title: string}) {
    const [splitEntries, setSplitEntries] = useState<Array<Array<EntryProps>>>([]);
    const [entries, setEntries] = useState<Array<EntryProps>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [length, setLength] = useState<number>(6);
    const [numberPerPage, setNumberPerPage] = useState<number>(6);

    const size = useWindowSize();
    useEffect(() => {
        if (!size) return;
        setNumberPerPage(Math.floor(size / 304));
    }, [size]);

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
        setIsLoading(true);
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
            case "searchedEntries":
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
    }, []);
    useEffect(() => {
        if (dataState === null || dataState[propKey] === null) return;
        const result: Array<Array<EntryProps>> = [];
        if (Array.isArray(dataState[propKey])) {
            setEntries(dataState[propKey] as Array<EntryProps>);
        } else {
            setEntries(type === "movie" ? dataState.moviesByGenre[title] : dataState.TVSeriesByGenre[title]);
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
    }, [numberPerPage, dataState, type, propKey, title, entries]);

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

    const handleTouch = (e: React.TouchEvent<HTMLElement>, start: boolean) => {
        changePage(e.changedTouches[0].clientX, start);
    };
    const handleDrag = (e: React.DragEvent<HTMLElement>, start: boolean) => {
        changePage(e.clientX, start);
    };
    let startingPosition = 0;
    const changePage = (clientX: number, start: boolean) => {
        if (start) {
            startingPosition = clientX;
            return;
        }
        if (clientX > startingPosition) {
            if (currentPage === 0) return;
            handlePageChange(false);
        }
        if (clientX < startingPosition) {
            if (currentPage === splitEntries.length - 1) return;
            handlePageChange(true);
        }
        startingPosition = 0;
    };
    if (error) {
        return <div className="w-full max-w-[100vw] h-[10rem] flex items-center justify-center">Failed Loading {title}. Try again later.</div>;
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
            <div className="flex gap-1 relative h-[10rem] justify-center sm:justify-normal w-full overflow-y-visible overflow-x-clip">
                <CarouselBackwardButton callback={handlePageChange} currentPage={currentPage}></CarouselBackwardButton>
                {!isLoading ? (
                    splitEntries.map((entries, i) => {
                        const left = i < currentPage ? true : false;
                        const right = i > currentPage ? true : false;

                        return (
                            <div
                                key={i}
                                className={clsx(
                                    `flex gap-1 absolute top-0 bottom-0 min-w-full transition-all duration-500 `,
                                    left ? `left-[-72%] lg:left-[-91%]` : right ? `left-[92%] lg:left-[97%]` : "left-[10%] lg:left-[3%]"
                                )}
                                style={{zIndex: left ? i + 10 : right ? 10 - i : ""}}
                            >
                                {entries.map((entry, j) => {
                                    const movieIndex =
                                        propKey === "trendingMoviesInPoland" || propKey === "trendingTVSeriesInPoland"
                                            ? dataState[propKey].findIndex(e => e.id === entry.id)
                                            : 0;
                                    return (
                                        <CarouselTile
                                            key={j}
                                            numberPerPage={numberPerPage}
                                            index={j}
                                            movieIndex={movieIndex}
                                            entry={entry}
                                            title={title}
                                            width={size || 0}
                                        ></CarouselTile>
                                    );
                                })}
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
