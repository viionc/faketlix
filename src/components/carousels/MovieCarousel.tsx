import clsx from "clsx";
import {useEffect, useState} from "react";
import MovieCarouselCard from "./MovieCarouselCard";
import {IMAGE_SMALL_PATH} from "../../types/constants";
import {MovieProps} from "../../types/types";

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
            <div className="py-3 pt-6 text-3xl ps-9 font-semibold">{title}</div>
            <div className="flex gap-1 relative h-[10rem] justify-center sm:justify-normal">
                <div
                    className={clsx(
                        "h-full w-[2rem] flex justify-center items-center hover:brightness-75 cursor-pointer z-[15] brightness-50 rounded-e-md",
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
                        const movieIndex = movies.findIndex(m => m.id === movie.id);
                        const image = movie.backdrop_path ? `${IMAGE_SMALL_PATH}${movie.backdrop_path}` : "noimage.png";
                        return (
                            <div
                                onMouseOver={() => setInfoTooltipId(movie.id)}
                                onMouseLeave={() => setInfoTooltipId(null)}
                                key={movie.id}
                                className="group hover:scale-150 transition w-[19rem] relative hover:z-[10] duration-500 "
                            >
                                <div
                                    className={clsx(
                                        "absolute top-0 left-0 w-[18.25rem] group-hover:top-[-50px] transition-all duration-500 ",
                                        position
                                    )}
                                >
                                    {title !== "Top 10 Movies In Poland" ? (
                                        <img
                                            src={`${image}`}
                                            className="rounded-md w-[18.25rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"
                                        ></img>
                                    ) : (
                                        <>
                                            <div className="rounded-md w-[18.25rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none relative visible group-hover:hidden">
                                                <img
                                                    className={clsx(`absolute top-0`, movieIndex + 1 === 10 ? "left-[10%]" : "left-[30%]")}
                                                    src={`/numbers/${movieIndex + 1}.png`}
                                                ></img>
                                                <img
                                                    className="absolute h-[10rem] w-[8rem] top-0 left-[55%] "
                                                    src={`${IMAGE_SMALL_PATH}${movie.poster_path}`}
                                                ></img>
                                            </div>
                                            <img
                                                src={`${image}`}
                                                className="rounded-md w-[18.25rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none hidden group-hover:block"
                                            ></img>
                                        </>
                                    )}
                                    {infoTooltipId === movie.id && <MovieCarouselCard movie={movie}></MovieCarouselCard>}
                                </div>
                            </div>
                        );
                    })}
                <div
                    className={clsx(
                        "h-full w-[2rem] flex justify-center items-center hover:bg-black hover:bg-opacity-30 cursor-pointer z-[15] rounded-s-md",
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
