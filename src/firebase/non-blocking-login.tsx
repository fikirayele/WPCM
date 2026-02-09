'use client';
import {
  Auth, // Import Auth type for type hinting
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
      let description = "An unexpected error occurred. Please try again.";
      // Firebase provides specific error codes for auth errors.
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === 'auth/invalid-email') {
        description = "The email address is not valid."
      } else if (error.code === 'auth/too-many-requests') {
          description = "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
      }
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
