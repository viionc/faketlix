import Navbar from "../../Navbar";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import {useModalContext} from "../../../context/ModalContext";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import FeaturedEntry from "../../FeaturedEntry";
import GenreCarousel from "../../carousels/GenreCarousel";

function TVPage() {
    const {modalState} = useModalContext();

    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center">
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>
            <FeaturedEntry type="tv"></FeaturedEntry>
            <Carousel type="tv" propKey="topRatedTVSeries" title="Top Rated"></Carousel>
            <Carousel type="tv" propKey="popularTVSeries" title="Popular"></Carousel>
            <Carousel type="tv" propKey="upcomingTVSeries" title="Upcoming"></Carousel>
            <Carousel type="tv" propKey="trendingTVSeriesInPoland" title="Top 10 In Poland"></Carousel>
            <GenreCarousel type="tv"></GenreCarousel>
            <Footer></Footer>
        </section>
    );
}

export default TVPage;
