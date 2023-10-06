import {useEffect, useState} from "react";
import {MovieProps} from "../types/types";
import {useModalContext} from "../context/ModalContext";
import {IMAGE_ORIGINAL_PATH} from "../types/constants";
function FeaturedMovie({movie}: {movie: MovieProps}) {
    const [movieLogo, setMovieLogo] = useState<string | null>();

    const {openModal} = useModalContext();

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_ACCESS_TOKEN}`,
            },
        };

        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/images`, options)
            .then(response => response.json())
            .then(response => {
                const englishLogo = response.logos.find((logo: any) => logo.iso_639_1 === "en");
                if (englishLogo) {
                    setMovieLogo(englishLogo.file_path);
                } else {
                    setMovieLogo(response.logos[0].file_path);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="w-full h-[60rem] relative mt-10">
            <img
                src={`${IMAGE_ORIGINAL_PATH}${movie.backdrop_path}`}
                className="w-full h-[60rem] absolute top-0 left-0 object-cover brightness-75 "
            ></img>
            <div className="w-full h-[15rem] z-10 absolute top-1/3 left-0 ps-20 gap-4 flex flex-col">
                {movieLogo ? (
                    <img src={`${IMAGE_ORIGINAL_PATH}${movieLogo}`} height={100} width={400} alt={movie.title + " logo"}></img>
                ) : (
                    <div className="font-4xl">{movie.title}</div>
                )}
                <div className="flex gap-2 font-semibold">
                    <button className="py-3 px-10 bg-white text-black text-2xl rounded-md hover:bg-opacity-[75%]">
                        <i className="fa-solid fa-play" style={{color: "#000000"}}></i> Play
                    </button>
                    <button
                        onClick={() => openModal(movie)}
                        className="py-3 px-10 bg-[#6E6D6D] text-2xl rounded-md text-white bg-opacity-[70%] hover:bg-opacity-[60%] flex justify-center items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                        </svg>
                        More Info
                    </button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedMovie;
