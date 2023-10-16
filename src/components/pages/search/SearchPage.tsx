import {useEffect, useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import {useModalContext} from "../../../context/ModalContext";
import MovieInformationModal from "../../modals/MovieInformationModal";
import TVSeriesInformationModal from "../../modals/TVSeriesInformationModal";
import useWindowSize from "../../../hooks/useWindowSize";
import SearchTile from "./SearchTile";

function SearchPage() {
    const {dataState} = useDataContext();
    const [numberPerPage, setNumberPerPage] = useState<number>(6);
    const {modalState} = useModalContext();

    const size = useWindowSize();
    useEffect(() => {
        if (!size) return;
        setNumberPerPage(Math.floor(size / 300));
    }, [size]);

    return (
        <section className="flex min-w-full min-h-[100vh] relative flex-col items-center pt-20">
            {modalState.isMovieInformationModalOpen && modalState.movieClicked && (
                <MovieInformationModal entry={modalState.movieClicked}></MovieInformationModal>
            )}
            {modalState.isTVSeriesInformationModalOpen && modalState.movieClicked && (
                <TVSeriesInformationModal entry={modalState.movieClicked}></TVSeriesInformationModal>
            )}
            <Navbar></Navbar>
            <div className="ps-4 container flex flex-wrap min-w-full justify-center gap-2 gap-y-6">
                {dataState.searchedEntries.length > 0 &&
                    dataState.searchedEntries.map((entry, i) => {
                        return <SearchTile key={i} width={size || 0} index={i} numberPerPage={numberPerPage} entry={entry}></SearchTile>;
                    })}
            </div>
            <Footer></Footer>
        </section>
    );
}

export default SearchPage;
