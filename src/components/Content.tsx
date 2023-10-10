import {useEffect, useRef, useState} from "react";
import Navbar from "./Navbar";
import FeaturedMovie from "./FeaturedMovie";
import MovieCarousel from "./carousels/MovieCarousel";
import Footer from "./Footer";
import Spinner from "./Spinner";
import {useDataContext} from "../context/DataContext";
import CarouselPlaceholder from "./carousels/CarouselPlaceholder";
import {useFirebaseContext} from "../context/FirebaseContext";
import {MOVIE_GENRES} from "../types/constants";

function Content() {
    const {
        getTopRatedMovies,
        topRatedMovies,
        featuredMovie,
        popularMovies,
        getPopularMovies,
        moviesByGenre,
        upcomingMovies,
        trendingInPoland,
        getMoviesByGenre,
        getUpcomingMovies,
        getTrendingInPoland,
        // planToWatch,
        // favoritedMovies,
        // checkPlanToWatch,
        // checkFavorites,
    } = useDataContext();

    const {currentProfile} = useFirebaseContext();
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
            response = await getTrendingInPoland();
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
    useEffect(() => {
        // checkPlanToWatch();
        // checkFavorites();
    }, [topRatedMovies, popularMovies, currentProfile]);
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
            <Navbar></Navbar>
            {featuredMovie ? (
                <FeaturedMovie movie={featuredMovie}></FeaturedMovie>
            ) : (
                <div className="h-[100vh] flex justify-center items-center">
                    <Spinner></Spinner>
                </div>
            )}

            {topRatedMovies && <MovieCarousel movies={topRatedMovies} title="Top Rated"></MovieCarousel>}
            {popularMovies && <MovieCarousel movies={popularMovies} title="Popular"></MovieCarousel>}
            {upcomingMovies && <MovieCarousel movies={upcomingMovies} title="Upcoming"></MovieCarousel>}
            {trendingInPoland && <MovieCarousel movies={trendingInPoland} title="Top 10 Movies In Poland"></MovieCarousel>}

            {/* {planToWatch && planToWatch.length > 0 && <MovieCarousel movies={planToWatch} title="Plan To Watch"></MovieCarousel>}
            {favoritedMovies && favoritedMovies.length > 0 && <MovieCarousel movies={favoritedMovies} title="Favorite"></MovieCarousel>} */}
            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    return (
                        moviesByGenre[Object.values(MOVIE_GENRES)[i]] && (
                            <MovieCarousel
                                key={i}
                                title={Object.values(MOVIE_GENRES)[i]}
                                movies={moviesByGenre[Object.values(MOVIE_GENRES)[i]]}
                            ></MovieCarousel>
                        )
                    );
                })}

            {/* {moviesByGenre[Object.values(MOVIE_GENRES)[1]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[1]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[1]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[2]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[2]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[2]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[3]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[3]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[3]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[4]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[4]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[4]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[5]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[5]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[5]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[6]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[6]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[6]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[7]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[7]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[7]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[8]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[8]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[8]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[9]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[9]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[9]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[10]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[10]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[10]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[11]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[11]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[11]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[12]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[12]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[12]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[13]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[13]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[13]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[14]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[14]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[14]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[15]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[15]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[15]]}></MovieCarousel>
            )}
            {moviesByGenre[Object.values(MOVIE_GENRES)[16]] && (
                <MovieCarousel title={Object.values(MOVIE_GENRES)[16]} movies={moviesByGenre[Object.values(MOVIE_GENRES)[16]]}></MovieCarousel>
            )} */}

            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default Content;
