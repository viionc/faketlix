import Navbar from "../../Navbar";
import Footer from "../../Footer";
import {useFirebaseContext} from "../../../context/FirebaseContext";
import {useEffect, useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import Carousel from "../../carousels/Carousel";
import {useModalContext} from "../../../context/ModalContext";
import MovieInformationModal from "../../modals/MovieInformationModal";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import CarouselPlaceholder from "../../carousels/CarouselPlaceholder";

function MyListPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {currentProfile} = useFirebaseContext();
    const {getPlanToWatchData, dataState, getFavoritesData} = useDataContext();
    const {modalState} = useModalContext();

    useEffect(() => {
        const fetchData = async () => {
            let response = await getPlanToWatchData();
            if (!response) {
                console.log("Failed to fetch plan to watch data");
            }
            response = await getFavoritesData();
            if (!response) {
                console.log("Failed to fetch favorites data");
            }
            setIsLoading(false);
        };

        fetchData();
    }, [currentProfile]);
    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col pt-20">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>

            {dataState.planToWatchMovies.length > 0 && <Carousel title="Plan To Watch Movies" entries={dataState.planToWatchMovies}></Carousel>}
            {dataState.planToWatchTVSeries.length > 0 && (
                <Carousel title="Plan To Watch TV Series" entries={dataState.planToWatchTVSeries}></Carousel>
            )}
            {dataState.favoritedMovies.length > 0 && <Carousel title="Favorite Movies" entries={dataState.favoritedMovies}></Carousel>}
            {dataState.favoritedTVSeries.length > 0 && <Carousel title="Favorite TV Series" entries={dataState.favoritedTVSeries}></Carousel>}
            {isLoading && <CarouselPlaceholder></CarouselPlaceholder>}
            <Footer></Footer>
        </section>
    );
}

export default MyListPage;
