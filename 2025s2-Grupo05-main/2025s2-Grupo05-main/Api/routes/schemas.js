import {object, string} from "yup";

export const loginBodySchema = object( {
    email: string().email("el mail no es valido").required("el mail es obligatorio"),
    password: string().required("Falta el password")
}).noUnknown(true, "Hay campos extras").strict();

export const postBodySchema = object({
    image: string().required("Es necesaria una imagen"),
    description: string()
}).noUnknown(true, "Hay campos extras").strict();

export const commentBodySchema = object( {

    body: string().required("Es necesario un comentario")

}).noUnknown(true, "Hay campos extras").strict();

export const registerBodySchema = object( {
    name: string().required("el nombre es obligatorio"),
    email: string().email("el mail no es valido").required("el mail es obligatorio"),
    password: string().required("Es necesario que el usuario tenga una password"),
    image: string().required("Es necesario que el usuario tenga una foto de perfil")
}).noUnknown(true, "Hay campos extras").strict();
