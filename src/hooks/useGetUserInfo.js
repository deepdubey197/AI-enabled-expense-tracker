export const useGetUserInfo = () => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData) {
        const { name, profilePhoto, userID, isAuth } = authData;
        return { name, profilePhoto, userID, isAuth };
    } else {
        // Handle the case where 'auth' data is not available in localStorage
        return { name: null, profilePhoto: null, userID: null, isAuth: null };
    }
};
