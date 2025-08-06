import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  preferredClass?: string;
  kycVerified?: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<UserProfile>) => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      console.log("Creating user with Firebase Auth...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);

      // Update display name
      if (userData.displayName) {
        console.log("Updating display name...");
        await updateProfile(user, { displayName: userData.displayName });
      }

      // Create user profile in Firestore
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || null,
        phoneNumber: userData.phoneNumber || null,
        photoURL: null,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address,
        emergencyContact: userData.emergencyContact,
        preferredClass: userData.preferredClass || '3A',
        kycVerified: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      console.log("Creating user profile in Firestore...");
      try {
        await setDoc(doc(db, 'users', user.uid), profile);
        console.log("User profile created successfully");
        setUserProfile(profile);
      } catch (firestoreError) {
        console.warn("Failed to create user profile in Firestore:", firestoreError);
        // Don't fail the signup if Firestore fails, just log the error
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName || null,
          phoneNumber: userData.phoneNumber || null,
          photoURL: null,
          kycVerified: false,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Re-throw to be handled by the calling function
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    if (auth.currentUser) {
      await updateLastLogin(auth.currentUser.uid);
    }
  };

  // Sign in with phone number
  const loginWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    // Initialize reCAPTCHA verifier
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    }, auth);

    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    await confirmationResult.confirm(otp);
    
    // Update last login
    if (auth.currentUser) {
      await updateLastLogin(auth.currentUser.uid);
    }
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<UserProfile>) => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, userData, { merge: true });

    // Update local state
    if (userProfile) {
      setUserProfile({ ...userProfile, ...userData });
    }
  };

  // Update last login timestamp
  const updateLastLogin = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user: User) => {
    try {
      // Try to get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile;
        setUserProfile(profileData);
        console.log("User profile loaded from Firestore");
      } else {
        // Create basic profile if it doesn't exist
        console.log("Creating new user profile...");
        const basicProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          kycVerified: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        try {
          await setDoc(doc(db, 'users', user.uid), basicProfile);
          setUserProfile(basicProfile);
          console.log("New user profile created successfully");
        } catch (createError) {
          console.warn("Failed to create user profile in Firestore, using local profile:", createError);
          setUserProfile(basicProfile);
        }
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);

      // Handle offline or connectivity issues
      if (error.code === 'failed-precondition' ||
          error.code === 'unavailable' ||
          error.message?.includes('offline') ||
          error.message?.includes('client is offline')) {

        console.log("Firebase is offline, creating temporary user profile");

        // Create a basic profile from Firebase Auth data when offline
        const offlineProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          kycVerified: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        setUserProfile(offlineProfile);
      } else {
        // For other errors, still create a basic profile to not break the app
        console.warn("Unknown Firestore error, creating fallback profile");
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          kycVerified: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        setUserProfile(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    loginWithPhone,
    verifyPhoneOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
