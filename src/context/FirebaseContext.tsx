import {initializeApp} from "firebase/app";
import {User, getAuth, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {FirebaseContextProps} from "../types/types";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export function useFirebaseContext() {
    const context = useContext(FirebaseContext);
    if (!context) throw new Error("Couldn't initialize Firebase Context.");
    return context;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);

export function FirebaseProvider({children}: {children: ReactNode}) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formTypeOpen, setFormTypeOpen] = useState<null | "LOGIN" | "REGISTER">("LOGIN");

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            if (user) {
                console.log("user logged in", new Date(Date.now()));
                setCurrentUser(user);
                setFormTypeOpen(null);
                // loadDataFromDatabase(user);
            }
        });
        return observer;
    }, []);

    const registerUser = async (email: string, password: string): Promise<any> => {
        let userCredential = null;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            return error;
        }

        setCurrentUser(userCredential.user);
    };

    const loginUser = (email: string, password: string): void | null => {
        signInWithEmailAndPassword(auth, email, password).catch(error => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    };

    const loginAnonymously = async () => {
        const userCredential = await signInAnonymously(auth);
        await updateProfile(userCredential.user, {
            displayName: `anon-${Math.floor(Math.random() * 10000)}`,
        });
        setCurrentUser(userCredential.user);
        // const profile = await createCurrentUserProfile(userCredential.user, null);
        // await addUserToDatabase(profile);
    };

    return <FirebaseContext.Provider value={{loginUser, formTypeOpen, setFormTypeOpen, registerUser}}>{children}</FirebaseContext.Provider>;
}
