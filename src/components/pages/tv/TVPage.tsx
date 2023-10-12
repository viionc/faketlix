import {useEffect, useRef, useState} from "react";
import Navbar from "../../Navbar";
import FeaturedTVSeries from "./FeaturedTVSeries";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import Spinner from "../../Spinner";
import {useDataContext} from "../../../context/DataContext";
import CarouselPlaceholder from "../../carousels/CarouselPlaceholder";
import {useModalContext} from "../../../context/ModalContext";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import {fetchPopularTVSeries, fetchTopRatedTVSeries, fetchTrendingTVSeriesInPoland, fetchUpcomingTVSeries} from "../../../utils/fetchData";

function TVPage() {
    const {dataState, dataDispatch} = useDataContext();

    const {modalState} = useModalContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, setPagesLoaded] = useState<number>(0);

    useEffect(() => {
        fetchData(true);
    }, []);

    const fetchData = async (initial?: boolean) => {
        if (isLoading) return;
        setIsLoading(true);
        let response;
        if (initial) {
            response = await fetchTopRatedTVSeries();
            if (!response) {
                console.log("Failed to load top rated movies");
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "topRatedTVSeries", data: response}});
                const number = Math.floor(Math.random() * response.length);
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "featuredTVSeries", data: response[number]}});
            }
            response = await fetchPopularTVSeries();
            if (!response) {
                console.log("Failed to popular movies");
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "popularTVSeries", data: response}});
            }
            response = await fetchUpcomingTVSeries();
            if (!response) {
                console.log("Failed to upcoming movies");
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "upcomingTVSeries", data: response}});
            }
            response = await fetchTrendingTVSeriesInPoland();
            if (!response) {
                console.log("Failed to top 10 trending movies");
            } else {
                dataDispatch({type: "UPDATE_MOVIES", payload: {name: "trendingTVSeriesInPoland", data: response}});
            }
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
            return;
        }

        // const key1 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded]);
        // const key2 = parseInt(Object.keys(MOVIE_GENRES)[pagesLoaded + 1]);

        // response = await getMoviesByGenre([key1, key2]);
        // if (!response) {
        //     console.log("Failed to load top rated movies");
        // }
        setTimeout(() => {
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
        }, 1000);
    };

    const observerTarget = useRef(null);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         entries => {
    //             if (pagesLoaded === 0 || pagesLoaded >= 18 || isLoading) return;
    //             if (entries[0].isIntersecting) {
    //                 fetchData();
    //             }
    //         },
    //         {threshold: 1}
    //     );
    //     if (observerTarget.current) {
    //         observer.observe(observerTarget.current);
    //     }

    //     return () => {
    //         if (observerTarget.current) {
    //             observer.unobserve(observerTarget.current);
    //         }
    //     };
    // }, [observerTarget, isLoading, pagesLoaded]);
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col">
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>
            {dataState.featuredTVSeries ? (
                <FeaturedTVSeries entry={dataState.featuredTVSeries}></FeaturedTVSeries>
            ) : (
                <div className="h-[100vh] flex justify-center items-center">
                    <Spinner></Spinner>
                </div>
            )}

            {dataState.topRatedTVSeries.length > 0 && <Carousel entries={dataState.topRatedTVSeries} title="Top Rated"></Carousel>}
            {dataState.popularTVSeries.length > 0 && <Carousel entries={dataState.popularTVSeries} title="Popular"></Carousel>}
            {dataState.upcomingTVSeries.length > 0 && <Carousel entries={dataState.upcomingTVSeries} title="Upcoming"></Carousel>}
            {dataState.trendingTVSeriesInPoland.length > 0 && (
                <Carousel entries={dataState.trendingTVSeriesInPoland} title="Top 10 TV Series In Poland"></Carousel>
            )}

            {/* {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = Object.values(MOVIE_GENRES)[i];
                    return moviesByGenre[genre] && <Carousel key={i} title={genre} data={moviesByGenre[genre]}></Carousel>;
                })} */}

            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default TVPage;
