import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {FirebaseProvider} from "./context/FirebaseContext.tsx";
import ModalContextProvider from "./context/ModalContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    //<React.StrictMode>
    <FirebaseProvider>
        <ModalContextProvider>
            <App />
        </ModalContextProvider>
    </FirebaseProvider>
    //  </React.StrictMode>
);
