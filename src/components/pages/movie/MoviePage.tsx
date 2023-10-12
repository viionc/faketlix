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
import {fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMoviesInPoland, fetchUpcomingMovies} from "../../../utils/fetchData";

function MoviePage() {
    const {dataState, moviesByGenre, getMoviesByGenre, dataDispatch} = useDataContext();
    const {modalState} = useModalContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const [error, setError] = useState({topRatedFailed: false, popularFailed: false, upcomingFailed: false, trendingInPoland: false});

    useEffect(() => {
        fetchData(true);
    }, []);

    const fetchData = async (initial?: boolean) => {
        if (isLoading) return;
        setIsLoading(true);
        let response;
        if (initial) {
            response = await fetchTopRatedMovies();
            if (!response) {
                setError(prev => ({...prev, topRatedFailed: true}));
                console.log(error);
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "topRatedMovies", data: response}});
                const number = Math.floor(Math.random() * response.length);
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "featuredMovie", data: response[number]}});
                setError(prev => ({...prev, topRatedFailed: false}));
            }
            response = await fetchPopularMovies();
            if (!response) {
                setError(prev => ({...prev, popularFailed: true}));
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "popularMovies", data: response}});
                setError(prev => ({...prev, popularFailed: false}));
            }
            response = await fetchUpcomingMovies();
            if (!response) {
                setError(prev => ({...prev, upcomingFailed: true}));
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "upcomingMovies", data: response}});
                setError(prev => ({...prev, upcomingFailed: false}));
            }
            response = await fetchTrendingMoviesInPoland();
            if (!response) {
                console.log("Failed to top 10 trending movies");
                setError(prev => ({...prev, trendingInPoland: true}));
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "trendingMoviesInPoland", data: response}});
                setError(prev => ({...prev, trendingInPoland: false}));
            }
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
            return;
        }
        const key1 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded]);
        const key2 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded + 1]);

        response = await getMoviesByGenre([key1, key2]);
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
        <section className="flex min-w-full min-h-[100vh] relative flex-col">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            <Navbar></Navbar>
            {dataState.featuredMovie ? (
                <FeaturedMovie entry={dataState.featuredMovie}></FeaturedMovie>
            ) : error.topRatedFailed ? (
                <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading Featured Movie. Try again later.</div>
            ) : (
                <div className="h-[100vh] flex justify-center items-center">
                    <Spinner></Spinner>
                </div>
            )}

            {!error.topRatedFailed ? (
                dataState.topRatedMovies.length > 0 && <Carousel entries={dataState.topRatedMovies} title="Top Rated"></Carousel>
            ) : (
                <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading Trending Movies. Try again later.</div>
            )}
            {!error.popularFailed ? (
                dataState.popularMovies.length > 0 && <Carousel entries={dataState.popularMovies} title="Popular"></Carousel>
            ) : (
                <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading Popular Movies. Try again later.</div>
            )}
            {!error.upcomingFailed ? (
                dataState.upcomingMovies.length > 0 && <Carousel entries={dataState.upcomingMovies} title="Upcoming"></Carousel>
            ) : (
                <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading Upcoming Movies. Try again later.</div>
            )}
            {!error.trendingInPoland ? (
                dataState.trendingMoviesInPoland.length > 0 && (
                    <Carousel entries={dataState.trendingMoviesInPoland} title="Top 10 Movies In Poland"></Carousel>
                )
            ) : (
                <div className="w-full h-[10rem] flex items-center justify-center">Failed Loading Top Ten In Poland Movies. Try again later.</div>
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
