import {useEffect, useRef, useState} from "react";
import Navbar from "../../Navbar";
import FeaturedTVSeries from "./FeaturedTVSeries";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import Spinner from "../../Spinner";
import {useDataContext} from "../../../context/DataContext";
import {useModalContext} from "../../../context/ModalContext";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import {TV_GENRES} from "../../../types/constants";

function TVPage() {
    const {dataState} = useDataContext();
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
            <Carousel type="tv" propKey="topRatedTVSeries" title="Top Rated"></Carousel>
            <Carousel type="tv" propKey="popularTVSeries" title="Popular"></Carousel>
            <Carousel type="tv" propKey="upcomingTVSeries" title="Upcoming"></Carousel>
            <Carousel type="tv" propKey="trendingTVSeriesInPoland" title="Top 10 In Poland"></Carousel>
            {Array(pagesLoaded)
                .fill("")
                .map((_, i) => {
                    const genre = Object.values(TV_GENRES)[i];
                    return <Carousel key={i} title={genre} type="tv" propKey={"TVSeriesByGenre"}></Carousel>;
                })}
            <div className="h-[2rem]" ref={observerTarget}></div>
            <Footer></Footer>
        </section>
    );
}

export default TVPage;
