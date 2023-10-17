import {EntryTypes} from "../../types/types";
import Carousel from "./Carousel";
import {MOVIE_GENRES, TV_GENRES} from "../../types/constants";
import {useState, useRef, useEffect} from "react";

function GenreCarousel({type}: {type: EntryTypes}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const observerTarget = useRef(null);
    useEffect(() => {
        const updatePage = () => {
            if (isLoading) return;
            setIsLoading(true);
            setTimeout(() => {
                setPagesLoaded(prev => prev + 2);
                setIsLoading(false);
            }, 500);
        };

        const observer = new IntersectionObserver(
            entries => {
                if (pagesLoaded >= Object.keys(TV_GENRES).length || isLoading) return;
                if (entries[0].isIntersecting) {
                    updatePage();
                }
            },
            {threshold: 1}
        );
        const current = observerTarget.current;
        if (current) {
            observer.observe(current);
        }
        return () => {
            if (current) {
                observer.unobserve(current);
            }
        };
    }, [observerTarget, isLoading, pagesLoaded]);

    return (
        <>
            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = type === "tv" ? Object.values(TV_GENRES)[i] : Object.values(MOVIE_GENRES)[i];
                    return <Carousel key={i} title={genre} type={type} propKey={type === "tv" ? "TVSeriesByGenre" : "moviesByGenre"}></Carousel>;
                })}
            <div className="h-[2rem]" ref={observerTarget}></div>
        </>
    );
}

export default GenreCarousel;
