import axios from "axios";
import Storage from "./storage";

const API = 'http://localhost:7080/';

const apiClient = axios.create({
    baseURL: API,
    withCredentials: true 
});

apiClient.interceptors.request.use((config) => {
    const token = Storage.getToken();
    if (token) {
        config.headers.Authorization = `${token}`;
        console.log('Enviando petición con token:',token);
    }
    return config;
    }, (error) => {
        return Promise.reject(error);
});


// Función para obtener los datos de un post específico por su ID
export const getPostById = async (postId) => {
    try {
        const response = await apiClient.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

export const deletePostById = async (postId) => {
    try {
        const response = await apiClient.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("No podes borrar ese post", error);
        throw error;
    }
};

export const toggleLikePost = async (postId) => {
    try {
        const response = await apiClient.put(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar 'me gusta':", error);
        throw error;
    }
};

export const postComment = async (postId, commentText) => {
    try {
        const response = await apiClient.post(`/posts/${postId}/comment`, { body: commentText });
        return response.data; 
    } catch (error) {
        console.error("Error al publicar el comentario:", error);
        throw error;
    }
};