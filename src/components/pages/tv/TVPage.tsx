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
import {TV_GENRES} from "../../../types/constants";

function TVPage() {
    const {dataState, dataDispatch, getByGenre} = useDataContext();

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
            if (dataState.topRatedTVSeries.length === 0) {
                response = await fetchTopRatedTVSeries();
                if (!response) {
                    console.log("Failed to load top rated movies");
                } else {
                    dataDispatch({type: "UPDATE_MOVIES", payload: {name: "topRatedTVSeries", data: response}});
                    const number = Math.floor(Math.random() * response.length);
                    dataDispatch({type: "UPDATE_MOVIES", payload: {name: "featuredTVSeries", data: response[number]}});
                }
            }
            if (dataState.popularTVSeries.length === 0) {
                response = await fetchPopularTVSeries();
                if (!response) {
                    console.log("Failed to popular movies");
                } else {
                    dataDispatch({type: "UPDATE_MOVIES", payload: {name: "popularTVSeries", data: response}});
                }
            }
            if (dataState.upcomingTVSeries.length === 0) {
                response = await fetchUpcomingTVSeries();
                if (!response) {
                    console.log("Failed to upcoming movies");
                } else {
                    dataDispatch({type: "UPDATE_MOVIES", payload: {name: "upcomingTVSeries", data: response}});
                }
            }
            if (dataState.trendingTVSeriesInPoland.length === 0) {
                response = await fetchTrendingTVSeriesInPoland();
                if (!response) {
                    console.log("Failed to top 10 trending movies");
                } else {
                    dataDispatch({type: "UPDATE_MOVIES", payload: {name: "trendingTVSeriesInPoland", data: response}});
                }
            }
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
            return;
        }

        const key1 = parseInt(Object.keys(TV_GENRES)[pagesLoaded]);
        const key2 = parseInt(Object.keys(TV_GENRES)[pagesLoaded + 1]);

        response = await getByGenre("tv", [key1, key2]);
        setTimeout(() => {
            setPagesLoaded(prev => prev + 2);
            setIsLoading(false);
        }, 1000);
    };

    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (pagesLoaded === 0 || pagesLoaded >= Object.keys(TV_GENRES).length || isLoading) return;
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

            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = Object.values(TV_GENRES)[i];
                    return dataState.TVSeriesByGenre[genre] && <Carousel key={i} title={genre} entries={dataState.TVSeriesByGenre[genre]}></Carousel>;
                })}

            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default TVPage;
