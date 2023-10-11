import "./App.css";
import {Routes, Route} from "react-router-dom";
import MoviePage from "./components/pages/movie/MoviePage";
import LoginForm from "./components/pages/login/LoginForm";
import ProfileScreen from "./components/pages/profile/ProfileScreen";
import RegisterForm from "./components/pages/login/RegisterForm";
import {FirebaseProvider} from "./context/FirebaseContext";
import ModalContextProvider from "./context/ModalContext";
import DataContextProvider from "./context/DataContext";
import MyListPage from "./components/pages/mylist/MyListPage";
import TVPage from "./components/pages/tv/TVPage";

function App() {
    // const {modalState} = useModalContext();
    return (
        <FirebaseProvider>
            <ModalContextProvider>
                <DataContextProvider>
                    <Routes>
                        <Route path="/" element={<LoginForm />}></Route>
                        <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
                        <Route path="/profiles" element={<ProfileScreen />}></Route>
                        <Route path="/movies" element={<MoviePage />}></Route>
                        <Route path="/mylist" element={<MyListPage></MyListPage>}></Route>
                        <Route path="/tv" element={<TVPage></TVPage>}></Route>
                        {/* {formTypeOpen === "REGISTER" && <RegisterForm></RegisterForm>} */}
                        {/* {account && !currentProfile && <ProfileScreen></ProfileScreen>} */}
                        {/* {currentProfile && <MoviePage></MoviePage>} */}
                        {/* {modalState.isMovieModalOpen && modalState.movieClicked && (
                <MovieInformationModal movie={modalState.movieClicked}></MovieInformationModal>
            )} */}
                    </Routes>
                </DataContextProvider>
            </ModalContextProvider>
        </FirebaseProvider>
    );
}

export default App;
