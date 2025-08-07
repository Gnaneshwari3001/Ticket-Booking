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
import { auth } from '@/lib/firebase';
import { userService, UserProfile as DatabaseUserProfile } from '@/lib/realtime-database';

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
  createdAt: any;
  lastLogin: any;
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

      // Create user profile in Realtime Database
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
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      console.log("Creating user profile in Realtime Database...");
      console.log("Profile data to save:", profile);

      try {
        await userService.createOrUpdateUser(profile);
        console.log("✅ User profile created successfully in Realtime Database");
        setUserProfile(profile);
      } catch (databaseError) {
        console.error("❌ Failed to create user profile in Realtime Database:", databaseError);

        // Check if it's a permission error
        if (databaseError instanceof Error) {
          if (databaseError.message.includes('permission') || databaseError.message.includes('PERMISSION_DENIED')) {
            console.error('🚫 Database permission denied - please check Firebase rules');
            throw new Error('Database permission denied. Please contact support.');
          }
        }

        // Don't fail the signup if database fails, just log the error and set local profile
        console.warn("⚠️ Continuing with local profile only");
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName || null,
          phoneNumber: userData.phoneNumber || null,
          photoURL: null,
          kycVerified: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
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
      await userService.updateLastLogin(auth.currentUser.uid);
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
      await userService.updateLastLogin(auth.currentUser.uid);
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

    // Update local state immediately for better UX
    if (userProfile) {
      setUserProfile({ ...userProfile, ...userData });
    }

    // Try to update Realtime Database
    try {
      await userService.updateUserProfile(currentUser.uid, userData);
      console.log("User profile updated in Realtime Database");
    } catch (error: any) {
      console.warn("Failed to update user profile in Realtime Database:", error);
      console.log("Update will be synced when back online");
      // The local state is already updated, so the user sees the change
      // Firebase Realtime Database will sync when back online
    }
  };


  // Load user profile from Realtime Database
  const loadUserProfile = async (user: User) => {
    try {
      // Try to get user profile from Realtime Database
      const profileData = await userService.getUserProfile(user.uid);
      if (profileData) {
        setUserProfile(profileData);
        console.log("User profile loaded from Realtime Database");
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
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        try {
          await userService.createOrUpdateUser(basicProfile);
          setUserProfile(basicProfile);
          console.log("New user profile created successfully");
        } catch (createError) {
          console.warn("Failed to create user profile in Realtime Database, using local profile:", createError);
          setUserProfile(basicProfile);
        }
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);

      console.log("Database connection issue, creating temporary user profile");

      // Create a basic profile from Firebase Auth data
      const offlineProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        kycVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUserProfile(offlineProfile);
    }
  };

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - proceeding without Firebase');
      setLoading(false);
    }, 5000); // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(loadingTimeout); // Clear timeout since auth state changed
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
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
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading RailEase Portal...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
