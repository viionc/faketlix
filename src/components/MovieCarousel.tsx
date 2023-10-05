import clsx from "clsx";
import React, {useEffect, useState} from "react";
import MovieCarouselInfo from "./MovieCarouselInfo";

function MovieCarousel({movies, title}: {movies: MovieProps[]; title: string}) {
    const [splitMovies, setSplitMovies] = useState<MovieProps[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);
    const numberPerPage = Math.floor((window.outerWidth - 64) / 304);

    useEffect(() => {
        console.log(numberPerPage);
        let result: MovieProps[][] = [];
        for (let i = 0; i < movies.length; i += numberPerPage) {
            const page = movies.slice(i, i + numberPerPage);
            result.push(page);
        }
        setSplitMovies(result);
        setLoaded(true);
    }, []);

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
            <div className="flex gap-2 relative h-[10rem] justify-center sm:justify-normal">
                <div
                    className={clsx(
                        "h-full w-[2rem] flex justify-center items-center hover:brightness-75 cursor-pointer z-[15] brightness-50",
                        currentPage > 0 ? "visible" : "invisible"
                    )}
                    onClick={() => handlePageChange(false)}
                    style={{
                        backgroundImage:
                            currentPage > 0
                                ? `url('https://image.tmdb.org/t/p/w500/${splitMovies[currentPage - 1][numberPerPage - 1].backdrop_path}')`
                                : "none",
                    }}
                >
                    <i className="fa-solid fa-chevron-left" style={{color: "#ffffff"}}></i>
                </div>
                {loaded &&
                    splitMovies[currentPage].map((movie, i) => {
                        let position = i === 0 ? "group-hover:left-[50px]" : i === numberPerPage - 1 ? "group-hover:left-[-50px]" : "";
                        return (
                            <div key={movie.id} className="group hover:scale-150 transition w-[19rem] relative hover:z-[10] duration-500 ">
                                <div
                                    className={clsx(
                                        "absolute top-0 left-0 w-[18.5rem] group-hover:top-[-50px]  transition-all duration-500",
                                        position
                                    )}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                                        className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"
                                    ></img>
                                    <MovieCarouselInfo movie={movie}></MovieCarouselInfo>
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
                                ? `url('https://image.tmdb.org/t/p/w500/${splitMovies[currentPage + 1][0].backdrop_path}')`
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
