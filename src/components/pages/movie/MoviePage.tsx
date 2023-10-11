import {useEffect, useRef, useState} from "react";
import Navbar from "../../Navbar";
import FeaturedMovie from "./FeaturedMovie";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import Spinner from "../../Spinner";
import {useDataContext} from "../../../context/DataContext";
import CarouselPlaceholder from "../../carousels/CarouselPlaceholder";
import {MOVIE_GENRES} from "../../../types/constants";
import MovieInformationModal from "../../modals/MovieInformationModal";
import {useModalContext} from "../../../context/ModalContext";

function MoviePage() {
    const {getTopRatedMovies, dataState, getPopularMovies, moviesByGenre, getMoviesByGenre, getUpcomingMovies, getTrendingMoviesInPoland} =
        useDataContext();

    const {modalState} = useModalContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);

    useEffect(() => {
        fetchData(true);
    }, []);

    const fetchData = async (initial?: boolean) => {
        if (isLoading) return;
        setIsLoading(true);
        let response;
        if (initial) {
            response = await getTopRatedMovies();
            if (!response) {
                console.log("Failed to load top rated movies");
            }
            response = await getPopularMovies();
            if (!response) {
                console.log("Failed to popular movies");
            }
            response = await getUpcomingMovies();
            if (!response) {
                console.log("Failed to upcoming movies");
            }
            response = await getTrendingMoviesInPoland();
            if (!response) {
                console.log("Failed to top 10 trending movies");
            }
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
            return;
        }

        const key1 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded]);
        const key2 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded + 1]);

        response = await getMoviesByGenre([key1, key2]);
        if (!response) {
            console.log("Failed to load top rated movies");
        }
        setTimeout(() => {
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
        }, 1000);
    };

    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (pagesLoaded === 0 || pagesLoaded >= 18 || isLoading) return;
                if (entries[0].isIntersecting) {
                    fetchData();
                }
            },
            {threshold: 1}
        );
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, isLoading, pagesLoaded]);
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            <Navbar></Navbar>
            {dataState.featuredMovie ? (
                <FeaturedMovie entry={dataState.featuredMovie}></FeaturedMovie>
            ) : (
                <div className="h-[100vh] flex justify-center items-center">
                    <Spinner></Spinner>
                </div>
            )}

            {dataState.topRatedMovies.length > 0 && <Carousel entries={dataState.topRatedMovies} title="Top Rated"></Carousel>}
            {dataState.popularMovies.length > 0 && <Carousel entries={dataState.popularMovies} title="Popular"></Carousel>}
            {dataState.upcomingMovies.length > 0 && <Carousel entries={dataState.upcomingMovies} title="Upcoming"></Carousel>}
            {dataState.trendingMoviesInPoland.length > 0 && (
                <Carousel entries={dataState.trendingMoviesInPoland} title="Top 10 Movies In Poland"></Carousel>
            )}
            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = Object.values(MOVIE_GENRES)[i];
                    return moviesByGenre[genre] && <Carousel key={i} title={genre} entries={moviesByGenre[genre]}></Carousel>;
                })}

            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default MoviePage;
