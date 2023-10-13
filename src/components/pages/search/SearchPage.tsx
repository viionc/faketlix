import {useEffect, useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import {EntryProps} from "../../../types/types";
import Carousel from "../../carousels/Carousel";
import {useModalContext} from "../../../context/ModalContext";
import MovieInformationModal from "../../modals/MovieInformationModal";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";

function SearchPage() {
    const {dataState} = useDataContext();
    const [splitEntries, setSplitEntries] = useState<Array<Array<EntryProps>>>([]);
    const {modalState} = useModalContext();

    useEffect(() => {
        const entries = dataState.searchedEntries;
        const numberPerCarousel = Math.floor((window.outerWidth - 64) / 304);
        const result: Array<Array<EntryProps>> = [];
        for (let i = 0; i < entries.length; i += numberPerCarousel) {
            const page = entries.slice(i, i + numberPerCarousel);
            result.push(page);
        }
        setSplitEntries(result);
    }, [dataState]);

    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center pt-20">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>
            <div className="container flex flex-wrap min-w-full">
                {splitEntries.length > 0 && splitEntries.map((entries, i) => <Carousel entries={entries} title="" key={i}></Carousel>)}
            </div>
            <Footer></Footer>
        </section>
    );
}

export default SearchPage;
