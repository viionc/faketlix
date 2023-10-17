import Navbar from "../../Navbar";
import FeaturedEntry from "../../FeaturedEntry";
import Carousel from "../../carousels/Carousel";
import Footer from "../../Footer";
import MovieInformationModal from "../../modals/MovieInformationModal";
import {useModalContext} from "../../../context/ModalContext";
import GenreCarousel from "../../carousels/GenreCarousel";

function MoviePage() {
    const {modalState} = useModalContext();
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            <Navbar></Navbar>
            <FeaturedEntry type="movie"></FeaturedEntry>
            <Carousel type="movie" propKey="topRatedMovies" title="Top Rated"></Carousel>
            <Carousel type="movie" propKey="popularMovies" title="Popular"></Carousel>
            <Carousel type="movie" propKey="upcomingMovies" title="Upcoming"></Carousel>
            <Carousel type="movie" propKey="trendingMoviesInPoland" title="Top 10 In Poland"></Carousel>
            <GenreCarousel type="movie"></GenreCarousel>
            <Footer></Footer>
        </section>
    );
}

export default MoviePage;
