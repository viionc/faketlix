import {ReactNode, createContext, useContext, useEffect, useReducer} from "react";
import {ModalAction, ModalActionNames, ModalActionPayload, ModalContextProps, ModalReducerState} from "../types/types";

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
        isManageProfilesModalOpen: false,
        movieClicked: null,
        profileCliked: null,
    };

    const modalReducer = (state: ModalReducerState, action: ModalAction) => {
        const {type, payload = {name: "movieClicked", value: null}, name} = action;
        switch (type) {
            case "OPEN_MODAL":
                return {
                    ...state,
                    [name]: true,
                    [payload.name]: payload.value,
                };
            case "CLOSE_MODAL":
                return {
                    ...state,
                    [name]: false,
                    movieClicked: null,
                    profileClicked: null,
                };
            default:
                return state;
        }
    };
    const [modalState, dispatch] = useReducer(modalReducer, MODALS_INITIAL_STATE);

    const openModal = (name: ModalActionNames, payload?: ModalActionPayload) => {
        dispatch({
            type: "OPEN_MODAL",
            payload,
            name,
        });
    };

    const closeModal = (name: ModalActionNames, payload?: ModalActionPayload) => {
        dispatch({
            type: "CLOSE_MODAL",
            payload,
            name,
        });
    };

    useEffect(() => {
        if (modalState.isMovieModalOpen || modalState.isCreateProfileModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modalState]);

    return <ModalContext.Provider value={{modalState, openModal, closeModal}}>{children}</ModalContext.Provider>;
}

export default ModalContextProvider;
