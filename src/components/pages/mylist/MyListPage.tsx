import Navbar from "../../Navbar";
import Footer from "../../Footer";
import Carousel from "../../carousels/Carousel";
import {useModalContext} from "../../../context/ModalContext";
import MovieInformationModal from "../../modals/MovieInformationModal";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";

function MyListPage() {
    const {modalState} = useModalContext();

    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col pt-20">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>

            <Carousel title="Plan To Watch Movies" type="movie" propKey="planToWatchMovies"></Carousel>
            <Carousel title="Plan To Watch TV Series" type="tv" propKey="planToWatchTVSeries"></Carousel>
            <Carousel title="Favorite Movies" type="movie" propKey="favoritedMovies"></Carousel>
            <Carousel title="Favorite TV Series" type="tv" propKey="favoritedTVSeries"></Carousel>
            <Footer></Footer>
        </section>
    );
}

export default MyListPage;
