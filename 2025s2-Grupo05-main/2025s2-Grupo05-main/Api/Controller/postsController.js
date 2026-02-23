import {transformPost} from "../dto.js"
import {postBodySchema} from "../routes/schemas.js";
import { commentBodySchema } from "../routes/schemas.js";

class PostController {
    constructor(system,tokenController) {
        this.system = system;
        this.tokenController = tokenController;
    }

    getPost = (req, res) => {
        try {
            const postId = req.params.postId;
            const post = this.system.getPost(postId);
            return res.json(transformPost(post));
        } 
        catch (err) {
            return res.status(404).json("Post no encontrado");
        }
        
    }

    createPost = async (req, res) => {

        try {
            const {image, description} = await postBodySchema.validate(req.body, {abortEarly: false});
            const drafPost = {
                image,
                description,
            };
            try {
                const user = this.tokenController.getUserFromToken(req);
                const post = this.system.addPost(user.id, drafPost);
                return res.status(200).json(transformPost(post));
            } catch (err) {
                return res.status(404).json({error: "Usuario con el ID dado no existe"});
            }
        } 
        catch (error) {
            const errores = error.inner.map(e => ({
                campo: e.path,
                mensaje: e.message
            }));
            return res.status(400).json({ errores });
        }
    }

    updatePost = async (req,res) => {
        try {
            const postId = req.params.postId;
            const {image,description} = await postBodySchema.validate(req.body,{abortEarly: false});
            const drafPost = {
                image,
                description,
            };
            try {
                const user = this.tokenController.getUserFromToken(req);
                const post = this.system.getPost(postId);

                if (post.user.id !== user.id) {
                res.status(403).json({ error: "No tienes permiso para modificar este post" });
                }

                let postUp = this.system.editPost(postId,drafPost);
                res.json(transformPost(postUp));

            } catch (err) {
                return res.status(404).json({ error: "Post no encontrado" });
            }
        } 
        catch (error) {
            const errores = error.inner.map(e => ({
                campo: e.path,
                mensaje: e.message
            }));
            return res.status(400).json({ errores });
        }
    } 

    deletePost = (req,res) => {
        try {
            const postId = req.params.postId;
            const user = this.tokenController.getUserFromToken(req);
            const post = this.system.getPost(postId);

            if (post.user.id !== user.id) {
            res.status(403).json({ error: "No tienes permiso para eliminar este post" });
            }

            this.system.deletePost(postId);
            res.status(204).json();

        } 
        catch (error) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
    }


    updateLike = (req,res) => {
        try {
            const postId = req.params.postId;
            const user = this.tokenController.getUserFromToken(req);
            const postUpdated = this.system.updateLike(postId, user.id);

            res.json(transformPost(postUpdated));
        } 
        catch (error) {
            return res.status(404).json({ error: "Post no encontrado" });
        }
    }

    updateComment = async (req,res) => {
        try {
            const postId = req.params.postId;
            const user = this.tokenController.getUserFromToken(req);  
            const comment = await commentBodySchema.validate(req.body,{abortEarly: false});

            try {
                const postUpdated = this.system.addComment(postId, user.id, comment);
                res.json(transformPost(postUpdated));
            } catch (error) {
                return res.status(404).json({ error: "Post no encontrado" });
            }
        }
        catch (error) {
            const errores = error.inner.map(e => ({
                campo: e.path,
                mensaje: e.message
            }));
            return res.status(400).json({ errores });
        }
    }
}

export default PostController