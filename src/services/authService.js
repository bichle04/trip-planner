import { auth, db } from './firebaseConfig'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithCredential,
    updateProfile,
    signOut
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import axios from 'axios'

// Email/Password Sign Up
export const signUpWithEmail = async (formData) => {
    try {
        // Validate form
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
            throw new Error('Please fill in all information')
        }
        
        if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match')
        }
        
        if (formData.password.length < 6) {
            throw new Error('Password must be at least 6 characters')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email.trim())) {
            throw new Error('Invalid email format')
        }
        
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email.trim(), 
            formData.password
        )
        
        const user = userCredential.user
        
        // Update user profile with full name
        await updateProfile(user, {
            displayName: formData.fullName.trim()
        })
        
        // Save additional user data to Firestore
        await setDoc(doc(db, 'Users', user.uid), {
            uid: user.uid,
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            createdAt: new Date(),
            loginMethod: 'email',
            role: 'user'
        })
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: formData.fullName.trim(),
            email: user.email,
            loginMethod: 'email',
            role: 'user'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Account created successfully!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error creating account:', error)
        let errorMessage = error.message || 'Cannot create account. Please try again.'
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email is already registered. Please use another email.'
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use a stronger password.'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format.'
        }
        
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
    }
}

// Email/Password Login
export const loginWithEmail = async (formData) => {
    try {
        // Validate form
        if (!formData.email.trim() || !formData.password.trim()) {
            throw new Error('Please fill in all information')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email.trim())) {
            throw new Error('Invalid email format')
        }
        
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
            auth, 
            formData.email.trim(), 
            formData.password
        )
        
        const user = userCredential.user
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'Users', user.uid))
        let userData = {}
        
        if (userDoc.exists()) {
            userData = userDoc.data()
        } else {
            // If no Firestore data, create from auth user
            userData = {
                uid: user.uid,
                fullName: user.displayName || 'User',
                email: user.email,
                loginMethod: 'email',
                role: 'user'
            }
            await setDoc(doc(db, 'Users', user.uid), userData)
        }
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: userData.fullName,
            email: user.email,
            loginMethod: userData.loginMethod || 'email',
            role: userData.role || 'user'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Login successfully!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error logging in:', error)
        let errorMessage = error.message || 'Login failed. Please try again.'
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Invalid credentials. Please check your email and password.'
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Invalid credentials. Please check your email and password.'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format.'
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many attempts. Please try again later.'
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid credentials. Please check your email and password.'
        }
        
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
    }
}

// Google OAuth
export const signInWithGoogle = async (tokenInfo) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json'
            }
        })
        
        const googleUser = response.data
        
        // Create credential from Google token
        const credential = GoogleAuthProvider.credential(null, tokenInfo.access_token)
        
        // Sign in with Firebase Auth
        const userCredential = await signInWithCredential(auth, credential)
        const user = userCredential.user
        
        // Save additional user data to Firestore and fetch role
        const userRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userRef);
        let userData = {
            uid: user.uid,
            fullName: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            loginMethod: 'google'
        };

        if (userDoc.exists()) {
            userData = { ...userDoc.data(), ...userData };
            await setDoc(userRef, userData, { merge: true });
        } else {
            userData.createdAt = new Date();
            userData.role = 'user';
            await setDoc(userRef, userData, { merge: true });
        }
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            loginMethod: 'google',
            role: userData.role || 'user'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Login successfully!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error logging in with Google:', error)
        toast.error('Login failed. Please try again.')
        return { success: false, error: error.message }
    }
}

// Logout
export const logout = async () => {
    try {
        // Sign out from Firebase
        await signOut(auth)
        // Clear localStorage
        localStorage.clear()
        return { success: true }
    } catch (error) {
        console.error('Error signing out:', error)
        // Still clear localStorage on error
        localStorage.clear()
        return { success: false, error: error.message }
    }
}
