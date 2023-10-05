import clsx from "clsx";
import React, {useEffect, useState} from "react";

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
                            <div className="group hover:scale-150 transition w-[19rem] relative hover:z-[10] duration-500 ">
                                <div
                                    className={clsx(
                                        "absolute top-0 left-0 w-[18.5rem] group-hover:top-[-50px]  transition-all duration-500",
                                        position
                                    )}
                                >
                                    <img
                                        key={movie.id}
                                        src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                                        className="rounded-md w-[19rem] h-[10rem] group-hover:rounded-t-md group-hover:rounded-b-none"
                                    ></img>
                                    <div className="hidden group-hover:flex w-full bg-[#181818] shadow-2xl">
                                        <div className="p-4 w-full h-[10rem] flex gap-2">
                                            <span className="h-[1.75rem] w-[1.75rem] bg-white rounded-full flex justify-center items-center">
                                                <i className="fa-solid fa-play" style={{color: "#000000"}}></i>
                                            </span>
                                            <span className="h-[1.75rem] w-[1.75rem] bg-[#303030] border border-white rounded-full flex justify-center items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </span>
                                            <span className="h-[1.75rem] w-[1.75rem] bg-[#303030] border border-white rounded-full flex justify-center items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
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
