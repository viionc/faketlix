import {ReactNode, createContext, useContext, useEffect, useState, useReducer} from "react";
import {ModalAction, ModalActionNames, ModalContextProps, ModalReducerState, MovieProps} from "../types/types";

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("Couldn't initialize Modal Context.");
    return context;
};

function ModalContextProvider({children}: {children: ReactNode}) {
    const MODALS_INITIAL_STATE: ModalReducerState = {
        isMovieModalOpen: false,
        isCreateProfileModalOpen: false,
        isProfileSettingsModalOpen: false,
        movieClicked: null,
    };

    const modalReducer = (state: ModalReducerState, action: ModalAction) => {
        const {type, payload, name} = action;
        switch (type) {
            case "OPEN_MODAL":
                return {
                    ...state,
                    [name]: true,
                    movieClicked: payload ? payload : null,
                };
            case "CLOSE_MODAL":
                return {
                    ...state,
                    [name]: false,
                    movieClicked: null,
                };
            default:
                return state;
        }
    };
    const [modalState, dispatch] = useReducer(modalReducer, MODALS_INITIAL_STATE);

    const openModal = (name: ModalActionNames, movie?: MovieProps) => {
        dispatch({
            type: "OPEN_MODAL",
            payload: movie || null,
            name,
        });
    };

    const closeModal = (name: ModalActionNames) => {
        dispatch({
            type: "CLOSE_MODAL",
            payload: null,
            name,
        });
    };

    useEffect(() => {
        if (modalState.isMovieModalOpen || modalState.isCreateProfileModalOpen || modalState.isProfileSettingsModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modalState]);

    return <ModalContext.Provider value={{modalState, openModal, closeModal}}>{children}</ModalContext.Provider>;
}

export default ModalContextProvider;
