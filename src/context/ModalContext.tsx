import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {ModalContextProps, MovieProps} from "../types/types";

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("Couldn't initialize Modal Context.");
    return context;
};

function ModalContextProvider({children}: {children: ReactNode}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movieClicked, setMovieClicked] = useState<MovieProps | null>(null);

    const openModal = (movie: MovieProps) => {
        setMovieClicked(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setMovieClicked(null);
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isModalOpen]);

    return (
        <ModalContext.Provider value={{isModalOpen, setIsModalOpen, movieClicked, setMovieClicked, openModal, closeModal}}>
            {children}
        </ModalContext.Provider>
    );
}

export default ModalContextProvider;
