import clsx from "clsx";
import {useEffect, useState} from "react";
import MovieCarouselInfo from "./MovieCarouselInfo";
import {IMAGE_SMALL_PATH} from "../types/constants";
import {MovieProps} from "../types/types";

function MovieCarousel({movies, title}: {movies: MovieProps[]; title: string}) {
    const [splitMovies, setSplitMovies] = useState<MovieProps[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [infoTooltipId, setInfoTooltipId] = useState<number | null>(null);
    const [numberPerPage] = useState<number>(Math.floor((window.outerWidth - 64) / 304));
    // const numberPerPage = Math.floor((window.outerWidth - 64) / 304);

    useEffect(() => {
        const result: MovieProps[][] = [];
        for (let i = 0; i < movies.length; i += numberPerPage) {
            const page = movies.slice(i, i + numberPerPage);
            result.push(page);
        }
        setSplitMovies(result);
        setLoaded(true);
    }, [movies, numberPerPage]);

    const handlePageChange = (add: boolean) => {
        if (add) {
            if (currentPage < movies.length / numberPerPage - 1) {
                setCurrentPage(prev => (prev += 1));
            }
        } else {
            if (currentPage > 0) {
                setCurrentPage(prev => (prev -= 1));
            }
        }
    };

    return (
        <section className="">
            <div className="py-2 pt-6 text-2xl ps-4 font-semibold">{title}</div>
            <div className="flex gap-1 relative h-[10rem] justify-center sm:justify-normal">
                <div
                    className={clsx(
                        "h-full w-[2rem] flex justify-center items-center hover:brightness-75 cursor-pointer z-[15] brightness-50",
                        currentPage > 0 ? "visible" : "invisible"
                    )}
                    onClick={() => handlePageChange(false)}
                    style={{
                        backgroundImage:
                            currentPage > 0 ? `url('${IMAGE_SMALL_PATH}${splitMovies[currentPage - 1][numberPerPage - 1].backdrop_path}')` : "none",
                    }}
                >
                    <i className="fa-solid fa-chevron-left" style={{color: "#ffffff"}}></i>
                </div>
                {loaded &&
                    splitMovies[currentPage].map((movie, i) => {
                        const position = i === 0 ? "group-hover:left-[50px]" : i === numberPerPage - 1 ? "group-hover:left-[-50px]" : "";
                        return (
                            <div
                                onMouseOver={() => setInfoTooltipId(movie.id)}
                                onMouseLeave={() => setInfoTooltipId(null)}
                                key={movie.id}
                                className="group hover:scale-150 transition w-[19rem] relative hover:z-[10] duration-500 "
                            >
                                <div
                                    className={clsx(
                                        "absolute top-0 left-0 w-[18.5rem] group-hover:top-[-50px] transition-all duration-500",
                                        position
                                    )}
                                >
                                    <img
                                        src={`${IMAGE_SMALL_PATH}${movie.backdrop_path}`}
                                        className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"
                                    ></img>
                                    {infoTooltipId === movie.id && <MovieCarouselInfo movie={movie}></MovieCarouselInfo>}
                                </div>
                            </div>
                        );
                    })}
                <div
                    className={clsx(
                        "h-full w-[2rem] flex justify-center items-center hover:bg-black hover:bg-opacity-30 cursor-pointer z-[15]",
                        currentPage < splitMovies.length - 1 ? "visible" : "invisible"
                    )}
                    style={{
                        backgroundImage:
                            currentPage < splitMovies.length - 1
                                ? `url('${IMAGE_SMALL_PATH}${splitMovies[currentPage + 1][0].backdrop_path}')`
                                : "none",
                    }}
                    onClick={() => handlePageChange(true)}
                >
                    <i className="fa-solid fa-chevron-right" style={{color: "#ffffff"}}></i>
                </div>
            </div>
        </section>
    );
}

export default MovieCarousel;
