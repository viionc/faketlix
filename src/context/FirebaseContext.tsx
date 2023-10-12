import {initializeApp} from "firebase/app";
import {User, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup} from "firebase/auth";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {ReactNode, createContext, useContext, useEffect, useState} from "react";
import {EntryProps, FirebaseContextProps, UserAccount, UserProfile} from "../types/types";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {GoogleAuthProvider} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

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
    const [error, setError] = useState<string | null>(null);
    const [manageProfiles, setManageProfiles] = useState<boolean>(false);
    const [localStoragePTWMovies, setLocalStoragePTWMovies] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-ptw-movies`,
        [] as EntryProps[]
    );
    const [localStoragePTWTVSeries, setLocalStoragePTWTVSeries] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-ptw-tvseries`,
        [] as EntryProps[]
    );
    const [localStorageFavoriteMovies, setLocalStorageFavoriteMovies] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-fav-movies`,
        [] as EntryProps[]
    );
    const [localStorageFavoriteTVSeries, setLocalStorageFavoriteTVSeries] = useLocalStorage(
        `${account?.id}-${currentProfile?.name}-fav-tvseries`,
        [] as EntryProps[]
    );

    const navigate = useNavigate();

    useEffect(() => {
        const observer = auth.onAuthStateChanged(user => {
            if (user) {
                console.log("user logged in", new Date(Date.now()));
                setFormTypeOpen(null);
                loadDataFromDatabase(user);
                setCurrentUser(user);
                navigate("/profiles");
            }
        });
        return observer;
    }, []);

    const registerUser = async (email: string, password: string): Promise<any> => {
        let userCredential = null;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const account = await createUserAccount(userCredential.user);
            if (!account) {
                setError("Couldn't create account.");
                throw new Error("Couldn't create account.");
            }
        } catch (error: any) {
            const errorMessage = error.message;
            setError(errorMessage);
            throw new Error("Couldn't create account.");
        }
        setError(null);
        setCurrentUser(userCredential.user);
    };

    const loginWithGoogle = async (): Promise<any> => {
        let userCredential = null;
        try {
            userCredential = await signInWithPopup(auth, googleProvider);
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(userCredential);
            if (!credential || !userCredential) {
                setError("Couldn't get Google credential.");
                throw new Error("Couldn't get credential.");
            }
        } catch (error: any) {
            const errorMessage = error.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        }
        // const token = credential.accessToken;
        const user = userCredential.user;
        let account = await loadDataFromDatabase(user);
        if (!account) {
            account = await createUserAccount(user);
            if (!account) {
                setError("Couldn't create account.");
                throw new Error("Couldn't create account.");
            }
            setAccount(account);
        }
        setError(null);
    };

    const loginUser = (email: string, password: string): void | null => {
        signInWithEmailAndPassword(auth, email, password).catch(error => {
            // const errorCode = error.code;
            setError(error.message);
            throw new Error(error.message);
        });
        setError(null);
    };

    const createUserAccount = async (user: User): Promise<false | UserAccount> => {
        const account: UserAccount = {
            id: user.uid,
            profiles: [
                {
                    name: user.email?.split("@")[0] || "Anonymous",
                    planToWatch: {movieIds: [], tvIds: []},
                    favoritedMovies: {movieIds: [], tvIds: []},
                    profileColor: "bg-blue-400",
                    autoplay: true,
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
        navigate("/");
        setCurrentProfile(null);
        setCurrentUser(null);
        setAccount(null);
        setFormTypeOpen("LOGIN");
    };
    const createProfile = (name: string, profileColor: string) => {
        if (!account) return;
        const profile = {
            name: name,
            planToWatch: {movieIds: [], tvIds: []},
            favoritedMovies: {movieIds: [], tvIds: []},
            profileColor,
            autoplay: true,
        };
        account.profiles.push(profile);
        setDoc(doc(db, "users", account.id), account).then(() => {
            setAccount(account);
        });
    };

    const updateProfile = (profileClicked: UserProfile, name: string, profileColor: string, autoplay: boolean) => {
        if (!account) return;
        profileClicked.name = name;
        profileClicked.profileColor = profileColor;
        profileClicked.autoplay = autoplay;
        setDoc(doc(db, "users", account.id), account);
    };
    const changeUserProfile = (profileName: string) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === profileName) as UserProfile;
        setCurrentProfile(profile);
        navigate("/movies");
    };

    const addToPlanToWatch = (type: "movie" | "tv", id: number) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (type === "movie") {
            if (profile.planToWatch.movieIds.includes(id)) return;
            profile.planToWatch.movieIds.push(id);
        } else if (type === "tv") {
            if (profile.planToWatch.tvIds.includes(id)) return;
            profile.planToWatch.tvIds.push(id);
        }
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const addToFavorites = (type: "movie" | "tv", id: number) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (type === "movie") {
            if (profile.favoritedMovies.movieIds.includes(id)) return;
            profile.favoritedMovies.movieIds.push(id);
        } else if (type === "tv") {
            if (profile.favoritedMovies.tvIds.includes(id)) return;
            profile.favoritedMovies.tvIds.push(id);
        }
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const removeFromPlanToWatch = (type: "movie" | "tv", id: number) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (type === "movie") {
            profile.planToWatch.movieIds = profile.planToWatch.movieIds.filter(_id => _id !== id);
            localStoragePTWMovies.filter(movie => movie.id !== id);
            setLocalStoragePTWMovies([...localStoragePTWMovies]);
        } else if (type === "tv") {
            profile.planToWatch.tvIds = profile.planToWatch.tvIds.filter(_id => _id !== id);
            localStoragePTWTVSeries.filter(tvseries => tvseries.id !== id);
            setLocalStoragePTWTVSeries([...localStoragePTWTVSeries]);
        }
        setCurrentProfile({...profile});
        setDoc(doc(db, "users", account.id), account);
    };

    const removeFromFavorites = (type: "movie" | "tv", id: number) => {
        if (!account) return;
        const profile = account.profiles.find(profile => profile.name === currentProfile?.name) as UserProfile;
        if (!profile) return;
        if (type === "movie") {
            profile.favoritedMovies.movieIds = profile.favoritedMovies.movieIds.filter(_id => _id !== id);
            localStorageFavoriteMovies.filter(movie => movie.id !== id);
            setLocalStorageFavoriteMovies([...localStorageFavoriteMovies]);
        } else if (type === "tv") {
            profile.favoritedMovies.tvIds = profile.favoritedMovies.tvIds.filter(_id => _id !== id);
            localStorageFavoriteTVSeries.filter(tvseries => tvseries.id !== id);
            setLocalStorageFavoriteTVSeries([...localStorageFavoriteTVSeries]);
        }
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
                manageProfiles,
                setManageProfiles,
                updateProfile,
                loginWithGoogle,
                error,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
}
