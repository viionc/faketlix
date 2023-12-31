import {useEffect, useState} from "react";
import {MOVIE_GENRES, TV_GENRES} from "../../types/constants";
import {EntryProps, EntryTypes, FetchKeys} from "../../types/types";
import CarouselForwardButton from "./CarouselForwardButton";
import CarouselBackwardButton from "./CarouselBackwardButton";
import {useDataContext} from "../../context/DataContext";
import CarouselPlaceholder from "./CarouselPlaceholder";
import CarouselTile from "./CarouselTile";
import clsx from "clsx";
import useWindowSize from "../../hooks/useWindowSize";
import {
    fetchByGenre,
    fetchPopularMovies,
    fetchPopularTVSeries,
    fetchTopRatedMovies,
    fetchTrendingMoviesInPoland,
    fetchTrendingTVSeriesInPoland,
    fetchUpcomingMovies,
    fetchUpcomingTVSeries,
} from "../../utils/fetchData";

function Carousel({propKey, type, title}: {type: EntryTypes; propKey: FetchKeys; title: string}) {
    const [splitEntries, setSplitEntries] = useState<Array<Array<EntryProps>>>([]);
    const [data, setData] = useState<Array<EntryProps>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [numberPerPage, setNumberPerPage] = useState<number>(6);
    const size = useWindowSize();
    useEffect(() => {
        if (!size) return;
        setNumberPerPage(Math.floor(size / 304));
    }, [size]);

    const {getPlanToWatchData, getFavoritesData} = useDataContext();
    // const numberPerPage = Math.floor((window.outerWidth - 64) / 304);
    const fetchData = async (propKey: FetchKeys, type: EntryTypes): Promise<void> => {
        setIsLoading(true);
        let response;
        let genreIndex;
        switch (propKey) {
            case "topRatedMovies":
                response = await fetchTopRatedMovies();
                break;
            case "upcomingMovies":
                response = await fetchUpcomingMovies();
                break;
            case "popularMovies":
                response = await fetchPopularMovies();
                break;
            case "trendingMoviesInPoland":
                response = await fetchTrendingMoviesInPoland();
                break;
            case "topRatedTVSeries":
                response = await fetchTopRatedMovies();
                break;
            case "upcomingTVSeries":
                response = await fetchUpcomingTVSeries();
                break;
            case "popularTVSeries":
                response = await fetchPopularTVSeries();
                break;
            case "trendingTVSeriesInPoland":
                response = await fetchTrendingTVSeriesInPoland();
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
                        ? (Object.keys(MOVIE_GENRES).find(key => MOVIE_GENRES[parseInt(key)] === title) as string)
                        : (Object.keys(TV_GENRES).find(key => TV_GENRES[parseInt(key)] === title) as string);
                response = await fetchByGenre(type, parseInt(genreIndex)); // await getByGenre(type, parseInt(genreIndex as string));
                break;
        }
        if (!response) {
            setError(true);
            setIsLoading(false);
            return;
        }
        if (Array.isArray(response) && response.length > 0) {
            setData(response);
        } else {
            if (propKey.includes("planToWatch") || propKey.includes("favorited")) {
                interface StorageResponse {
                    movies: EntryProps[];
                    tvSeries: EntryProps[];
                }
                type === "movie" ? setData((response as StorageResponse).movies) : setData((response as StorageResponse).tvSeries);
            }
        }
    };

    useEffect(() => {
        fetchData(propKey, type);
    }, []);

    useEffect(() => {
        if (!data.length) return;
        const result: Array<Array<EntryProps>> = [];
        for (let i = 0; i < data.length; i += numberPerPage) {
            const page = data.slice(i, i + numberPerPage);
            result.push(page);
        }
        setSplitEntries(result);
        setTimeout(() => {
            setIsLoading(false);
            setError(false);
        }, 500);
    }, [numberPerPage, type, propKey, title, data]);

    const handlePageChange = (add: boolean) => {
        if (add) {
            if (currentPage < data.length / numberPerPage - 1) {
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
                                    const movieIndex = data.findIndex(e => e.id === entry.id);

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
