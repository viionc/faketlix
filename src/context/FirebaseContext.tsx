import {initializeApp} from "firebase/app";
import {User, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {FirebaseContextProps, MovieProps, UserAccount, UserProfile} from "../types/types";

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
    const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
    const [account, setAccount] = useState<UserAccount | null>(null);

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            if (user) {
                console.log("user logged in", new Date(Date.now()));
                setFormTypeOpen(null);
                loadDataFromDatabase(user);
                setCurrentUser(user);
            }
        });
        return observer;
    }, []);

    const registerUser = async (email: string, password: string): Promise<any> => {
        let userCredential = null;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const account = await createUserAccount(userCredential.user);
            if (!account) throw new Error("Couldn't create account.");
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

    const createUserAccount = async (user: User): Promise<false | UserAccount> => {
        const account: UserAccount = {
            id: user.uid,
            profiles: [
                {
                    name: user.email?.split("@")[0] || "Anonymous",
                    planToWatch: [],
                    favoritedMovies: [],
                },
            ],
        };
        try {
            await setDoc(doc(db, "users", user.uid), account);
            return account;
        } catch (err) {
            console.log(err);
            return false;
        }
    };
    const loadDataFromDatabase = async (user: User): Promise<false | UserAccount> => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAccount(docSnap.data() as UserAccount);
        }
        return false;
    };

    const logoutUser = () => {
        signOut(auth);
        setCurrentProfile(null);
        setCurrentUser(null);
        setAccount(null);
        setFormTypeOpen("LOGIN");
    };
    const createProfile = (name: string) => {
        if (!account) return;
        const profile = {
            name: name,
            planToWatch: [],
            favoritedMovies: [],
        };
        account.profiles.push(profile);
        setDoc(doc(db, "users", account.id), account).then(() => {
            setAccount(account);
        });
    };
    const changeUserProfile = (profileName: string) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === profileName) as UserProfile;
        setCurrentProfile(profile);
    };

    const addToPlanToWatch = (movie: MovieProps) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (profile.planToWatch.includes(movie.id)) return;
        profile.planToWatch.push(movie.id);
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const addToFavorites = (movie: MovieProps) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (profile.favoritedMovies.includes(movie.id)) return;
        profile.favoritedMovies.push(movie.id);
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const removeFromPlanToWatch = (movie: MovieProps) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        profile.planToWatch = profile.planToWatch.filter(id => id !== movie.id);
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const removeFromFavorites = (movie: MovieProps) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        profile.favoritedMovies = profile.favoritedMovies.filter(id => id !== movie.id);
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    return (
        <FirebaseContext.Provider
            value={{
                loginUser,
                formTypeOpen,
                setFormTypeOpen,
                registerUser,
                currentUser,
                logoutUser,
                account,
                currentProfile,
                changeUserProfile,
                addToFavorites,
                addToPlanToWatch,
                removeFromPlanToWatch,
                removeFromFavorites,
                createProfile,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}
