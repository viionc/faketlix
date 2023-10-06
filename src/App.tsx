import "./App.css";
import Content from "./components/Content";
import LoginForm from "./components/LoginForm";
import MovieInformationModal from "./components/MovieInformationModal";
import RegisterForm from "./components/RegisterForm";
import {useFirebaseContext} from "./context/FirebaseContext";
import {useModalContext} from "./context/ModalContext";

function App() {
    const {formTypeOpen} = useFirebaseContext();
    const {isModalOpen, movieClicked} = useModalContext();
    return (
        <>
            {formTypeOpen === "LOGIN" && <LoginForm></LoginForm>}
            {formTypeOpen === "REGISTER" && <RegisterForm></RegisterForm>}
            {formTypeOpen === null && <Content></Content>}
            {isModalOpen && movieClicked && <MovieInformationModal movie={movieClicked}></MovieInformationModal>}
        </>
    );
}

export default App;
