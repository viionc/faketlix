import {useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import {useModalContext} from "../../../context/ModalContext";
import MovieInformationModal from "../../modals/MovieInformationModal";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import CarouselTile from "../../carousels/CarouselTile";

function SearchPage() {
    const {dataState} = useDataContext();
    const [numberPerPage] = useState<number>(Math.floor((window.outerWidth - 64) / 304));
    const {modalState} = useModalContext();

    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center pt-20">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>
            <div className="ps-4 container flex flex-wrap min-w-full justify-start gap-2 gap-y-6">
                {dataState.searchedEntries.length > 0 &&
                    dataState.searchedEntries.map((entry, i) => {
                        const position =
                            (i + 1 !== 1 && (i + 1) % numberPerPage === 1) || i === 0
                                ? "left-0 md:group-hover:left-[50px]"
                                : i !== 0 && (i + 1) % numberPerPage === 0
                                ? "group-hover:left-[-50px]"
                                : "";
                        console.log(i, position);
                        return <CarouselTile key={i} title={""} position={position} movieIndex={i} entry={entry}></CarouselTile>;
                    })}
            </div>
            <Footer></Footer>
        </section>
    );
}

export default SearchPage;
