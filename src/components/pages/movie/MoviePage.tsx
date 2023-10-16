import {useEffect, useRef, useState} from "react";
import Navbar from "../../Navbar";
import FeaturedEntry from "../../FeaturedEntry";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import {MOVIE_GENRES} from "../../../types/constants";
import MovieInformationModal from "../../modals/MovieInformationModal";
import {useModalContext} from "../../../context/ModalContext";

function MoviePage() {
    const {modalState} = useModalContext();
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
                if (pagesLoaded >= Object.keys(MOVIE_GENRES).length || isLoading) return;
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
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            <Navbar></Navbar>
            <FeaturedEntry type="movie"></FeaturedEntry>
            <Carousel type="movie" propKey="topRatedMovies" title="Top Rated"></Carousel>
            <Carousel type="movie" propKey="popularMovies" title="Popular"></Carousel>
            <Carousel type="movie" propKey="upcomingMovies" title="Upcoming"></Carousel>
            <Carousel type="movie" propKey="trendingMoviesInPoland" title="Top 10 In Poland"></Carousel>
            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = Object.values(MOVIE_GENRES)[i];
                    return <Carousel key={i} title={genre} type="movie" propKey={"moviesByGenre"}></Carousel>;
                })}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default MoviePage;
