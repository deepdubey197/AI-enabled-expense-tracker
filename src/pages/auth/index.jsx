import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import "./styles.css";
import { useEffect } from "react";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";

export const Auth = () => {
    const navigate = useNavigate();
    const { isAuth } = useGetUserInfo();

    const signInWithGoogle = async () => {
        const results = await signInWithPopup(auth, provider);
        const authInfo = {
            userID: results.user.uid,
            name: results.user.displayName,
            profilePhoto: results.user.photoURL,
            isAuth: true,
        };
        localStorage.setItem("auth", JSON.stringify(authInfo));
        navigate("/expense-tracker");
    };

    if (isAuth) {
        return <Navigate to="/expense-tracker" />;
    }

    return (
        <div className="login-page">
            <div className="inner">
                <p>Sign In with Google to continue.</p>
                <button className="login-with-google-btn" onClick={signInWithGoogle}>Sign in with Google</button>
            </div>
        </div>
    );
};
