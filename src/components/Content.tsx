import {useEffect} from "react";
import Navbar from "./Navbar";
import FeaturedMovie from "./FeaturedMovie";
import MovieCarousel from "./MovieCarousel";
import Footer from "./Footer";
import Spinner from "./Spinner";
import {useDataContext} from "../context/DataContext";
import CarouselPlaceholder from "./CarouselPlaceholder";
import {useFirebaseContext} from "../context/FirebaseContext";

function Content() {
    const {
        getTopRatedMovies,
        topRatedMovies,
        featuredMovie,
        popularMovies,
        getPopularMovies,
        planToWatch,
        favoritedMovies,
        checkPlanToWatch,
        checkFavorites,
    } = useDataContext();
    const {currentProfile} = useFirebaseContext();

    useEffect(() => {
        getTopRatedMovies().then(response => {
            if (!response) {
                console.log("Failed to load top rated movies");
            }
        });
        getPopularMovies().then(response => {
            if (!response) {
                console.log("Failed to load popular movies");
            }
        });
    }, []);

    useEffect(() => {
        checkPlanToWatch();
        checkFavorites();
    }, [topRatedMovies, popularMovies, currentProfile]);

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
            {planToWatch && planToWatch.length > 0 && <MovieCarousel movies={planToWatch} title="Plan To Watch"></MovieCarousel>}
            {favoritedMovies && favoritedMovies.length > 0 && <MovieCarousel movies={favoritedMovies} title="Favorite"></MovieCarousel>}
            <Footer></Footer>
        </section>
    );
}

export default Content;
