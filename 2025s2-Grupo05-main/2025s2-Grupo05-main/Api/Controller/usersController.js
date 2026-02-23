import { HEADER } from "./constants.js";
import { transformUserWithPost, transformUser } from "../dto.js";
import {loginBodySchema,registerBodySchema} from "../routes/schemas.js";

class UserController {
    constructor(system, tokenController) {
        this.system = system;
        this.tokenController = tokenController;
    }

    login = async (req, res) => {
        try {
            const {email, password} = await loginBodySchema.validate(req.body,{abortEarly: false});

            
            try{
                const user = this.system.login(email, password);
                const token = this.tokenController.generateToken(user.id);
                res.header(HEADER, token).json(transformUser(user));
            }
            catch{
                res.status(401).json('Credenciales incorrectas');
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


    register = async (req, res) => {
        try {
            const {name,email, password,image} = await registerBodySchema.validate(req.body,{abortEarly: false});
            const drafuser = {
                name,
                email,
                password,
                image,
            };

            
            try {
                const user = this.system.register(drafuser);
                const token = this.tokenController.generateToken(user.id);
                let posts = [];
                res.header(HEADER, token).json(transformUserWithPost(transformUser(user),posts));
            }
            catch(err){
                res.status(404).json(`Usuario con mail '${email}' ya se encuentra registrado`);
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

    getUser = (req, res) => {
        try{
            const userId = req.params.userId;
            const user = this.system.getUser(userId);
            const posts = this.system.getPostByUserId(userId);
            res.json(transformUserWithPost(transformUser(user),posts));
        } 
        catch {

            return res.status(404).json('Usuario no encontrado');
        }
        
    };

    getTimeline = async (req, res) => {
        try {
            const user = this.tokenController.getUserFromToken(req);
            const timeline = await this.system.timeline(user.id);

            return res.status(200).json({
                success: true,
                data: transformUserWithPost(transformUser(user), timeline)
            });
        } 
        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Unable to fetch timeline',
                error: error.message
            });
        }
    };

    updateFollow = (req, res) => {
        try {
            const user = this.tokenController.getUserFromToken(req);
            const userFollowed = req.params.userId;

            if (user.id == userFollowed) {
                return res.status(400).json(" error : No puedes seguirte a ti mismo");
            }
            const userFollowedUpdate =  this.system.updateFollower(user.id, userFollowed); 
            return res.json(transformUser(userFollowedUpdate)); 
        } 
        catch (error) {
            return res.status(404).json(" error : Usuario no encontrado");
        }
    }
}

export default UserController;

