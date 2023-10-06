import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import FeaturedMovie from "./FeaturedMovie";
import MovieCarousel from "./MovieCarousel";
import Footer from "./Footer";
import Spinner from "./Spinner";
import {useDataContext} from "../context/DataContext";
import CarouselPlaceholder from "./CarouselPlaceholder";

function Content() {
    const [, setDataLoaded] = useState<boolean>(false);
    // const [error, setError] = useState(false);

    const {getTopRatedMovies, topRatedMovies, featuredMovie, popularMovies, getPopularMovies} = useDataContext();

    useEffect(() => {
        getTopRatedMovies().then(response => {
            if (response) {
                setDataLoaded(true);
            }
        });
        getPopularMovies().then(response => {
            if (response) {
                setDataLoaded(true);
            }
        });
    }, []);
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col">
            <Navbar></Navbar>
            {featuredMovie ? (
                <FeaturedMovie movie={featuredMovie}></FeaturedMovie>
            ) : (
                <div className="h-[100vh] flex justify-center items-center">
                    <Spinner></Spinner>
                </div>
            )}
            {topRatedMovies ? <MovieCarousel movies={topRatedMovies} title="Top Rated"></MovieCarousel> : <CarouselPlaceholder></CarouselPlaceholder>}
            {popularMovies ? <MovieCarousel movies={popularMovies} title="Popular"></MovieCarousel> : <CarouselPlaceholder></CarouselPlaceholder>}
            <Footer></Footer>
        </section>
    );
}

export default Content;
