import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import FeaturedMovie from "./FeaturedMovie";
import MovieCarousel from "./MovieCarousel";
import Footer from "./Footer";

function Content() {
    const [topRatedMovies, setTopRatedMovies] = useState<MovieProps[] | null>(null);
    const [featuredMovie, setFeaturedMovie] = useState<MovieProps | null>(null);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_ACCESS_TOKEN}`,
            },
        };

        fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options)
            .then(response => response.json())
            .then(response => {
                setTopRatedMovies(response.results);
                let number = Math.floor(Math.random() * response.results.length);
                setFeaturedMovie(response.results[number]);
            })
            .then(() => setDataLoaded(true))
            .catch(err => console.error(err));
    }, []);
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col">
            <Navbar></Navbar>
            {dataLoaded && featuredMovie && <FeaturedMovie movie={featuredMovie}></FeaturedMovie>}
            {dataLoaded && topRatedMovies && <MovieCarousel movies={topRatedMovies} title="Top Rated"></MovieCarousel>}
            <Footer></Footer>
        </section>
    );
}

export default Content;
