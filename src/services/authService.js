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
            throw new Error('Vui lòng điền đầy đủ thông tin')
        }
        
        if (formData.password !== formData.confirmPassword) {
            throw new Error('Mật khẩu không khớp')
        }
        
        if (formData.password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email.trim())) {
            throw new Error('Email không đúng định dạng')
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
            loginMethod: 'email'
        })
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: formData.fullName.trim(),
            email: user.email,
            loginMethod: 'email'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Tạo tài khoản thành công!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error creating account:', error)
        let errorMessage = error.message || 'Không thể tạo tài khoản. Vui lòng thử lại.'
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email này đã được đăng ký. Vui lòng sử dụng email khác.'
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email không đúng định dạng.'
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
            throw new Error('Vui lòng điền đầy đủ thông tin')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email.trim())) {
            throw new Error('Email không đúng định dạng')
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
                loginMethod: 'email'
            }
            await setDoc(doc(db, 'Users', user.uid), userData)
        }
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: userData.fullName,
            email: user.email,
            loginMethod: userData.loginMethod || 'email'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Đăng nhập thành công!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error logging in:', error)
        let errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Nhập sai thông tin đăng nhập. Vui lòng kiểm tra lại email và mật khẩu.'
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Nhập sai thông tin đăng nhập. Vui lòng kiểm tra lại email và mật khẩu.'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email không đúng định dạng.'
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.'
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Nhập sai thông tin đăng nhập. Vui lòng kiểm tra lại email và mật khẩu.'
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
        
        // Save additional user data to Firestore
        await setDoc(doc(db, 'Users', user.uid), {
            uid: user.uid,
            fullName: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            createdAt: new Date(),
            loginMethod: 'google'
        }, { merge: true })
        
        // Save user info to localStorage
        const userInfo = {
            uid: user.uid,
            fullName: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            loginMethod: 'google'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        toast.success('Đăng nhập thành công!')
        return { success: true, user: userInfo }
        
    } catch (error) {
        console.error('Error logging in with Google:', error)
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
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
