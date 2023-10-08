import "./App.css";
import Content from "./components/Content";
import LoginForm from "./components/forms/LoginForm";
import MovieInformationModal from "./components/modals/MovieInformationModal";
import ProfileScreen from "./components/ProfileScreen";
import RegisterForm from "./components/forms/RegisterForm";
import {useFirebaseContext} from "./context/FirebaseContext";
import {useModalContext} from "./context/ModalContext";

function App() {
    const {formTypeOpen, account, currentProfile} = useFirebaseContext();
    const {modalState} = useModalContext();
    return (
        <>
            {formTypeOpen === "LOGIN" && <LoginForm></LoginForm>}
            {formTypeOpen === "REGISTER" && <RegisterForm></RegisterForm>}
            {account && !currentProfile && <ProfileScreen></ProfileScreen>}
            {currentProfile && <Content></Content>}
            {modalState.isMovieModalOpen && modalState.movieClicked && (
                <MovieInformationModal movie={modalState.movieClicked}></MovieInformationModal>
            )}
        </>
    );
}

export default App;
