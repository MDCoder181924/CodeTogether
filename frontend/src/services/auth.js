import api from "./api";

// export const getProfile = async () => {
//     try{
//         const response = await api.get('/user/profile');
//         return response.data;
//     }
//     catch(error){
//         console.error("Error fetching profile:", error);
//         throw error;
//     }
// }

export const getProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
}