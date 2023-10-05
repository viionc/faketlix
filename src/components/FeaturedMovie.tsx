import clsx from "clsx";
import {useEffect, useRef, useState} from "react";
function FeaturedMovie({movie}: {movie: MovieProps}) {
    const [movieLogo, setMovieLogo] = useState<string | null>();
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
                let englishLogo = response.logos.find((logo: any) => logo.iso_639_1 === "en");
                if (englishLogo) {
                    setMovieLogo(englishLogo.file_path);
                } else {
                    setMovieLogo(response.logos[0].file_path);
                }
            })
            .catch(err => console.error(err));
    }, []);
    let bg = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    //@ts-ignore

    // const backdropUrl = `bg-[url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')]`;
    // ("bg-[url('/login-backdrop.jpg')]");
    return (
        <section className="w-full h-[60rem] relative mt-10">
            <img src={bg} className="w-full h-full absolute top-0 left-0 object-cover brightness-75 "></img>
            <div className="w-full h-[15rem] z-10 absolute top-1/3 left-0 ps-20 gap-4 flex flex-col">
                {movieLogo ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movieLogo}`} height={100} width={400} alt={movie.original_title + " logo"}></img>
                ) : (
                    <div className="font-4xl">{movie.original_title}</div>
                )}
                <div className="flex gap-2 font-semibold">
                    <button className="py-3 px-10 bg-white text-black text-2xl rounded-md hover:bg-opacity-[75%]">
                        <i className="fa-solid fa-play" style={{color: "#000000"}}></i> Play
                    </button>
                    <button className="py-3 px-10 bg-[#6E6D6D] text-2xl rounded-md text-white bg-opacity-[70%] hover:bg-opacity-[60%]">
                        <i className="fa-solid fa-circle-info" style={{color: "#ffffff"}}></i> More Info
                    </button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedMovie;
