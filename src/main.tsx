import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {FirebaseProvider} from "./context/FirebaseContext.tsx";
import ModalContextProvider from "./context/ModalContext.tsx";
import DataContextProvider from "./context/DataContext.tsx";
import ScrollToTop from "./components/ScrollTop.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    //<React.StrictMode>
    <BrowserRouter>
        <FirebaseProvider>
            <ModalContextProvider>
                <DataContextProvider>
                    <ScrollToTop />
                    <App />
                </DataContextProvider>
            </ModalContextProvider>
        </FirebaseProvider>
    </BrowserRouter>
    //</React.StrictMode>
);
