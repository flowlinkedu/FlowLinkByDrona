// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsuZL4U2H66C9tUKN91KXMm-l5umOa1vY",
    authDomain: "flowlinkkiro.firebaseapp.com",
    projectId: "flowlinkkiro",
    storageBucket: "flowlinkkiro.firebasestorage.app",
    messagingSenderId: "918596906932",
    appId: "1:918596906932:web:55e2a235cefedd61098ce1",
    measurementId: "G-B32FNF648G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export {
    app,
    analytics,
    auth,
    googleProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};