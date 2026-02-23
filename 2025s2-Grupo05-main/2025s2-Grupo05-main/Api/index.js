import getInstagramSystem from "@unq-ui/instagram-model-js";
import express from "express";
import createAuthenticationRouter from "./routes/authenticationRouter.js";
import {createUserGetRouter,createUserPutRouter} from "./routes/userRoutes.js";
import createPostRouter from "./routes/postRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import UserController from "./Controller/usersController.js";
import TokenController from "./Controller/tokenController.js";
import PostController  from "./Controller/postsController.js";
import SearchController from "./Controller/searchController.js";
import cors from "cors";


const system = getInstagramSystem();

const app = express();

const port = 7080;


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Se crea la instancia del controlador una sola vez
const tokenController = new TokenController(system);
const userController = new UserController(system, tokenController);
const postController = new PostController(system,tokenController);
const searchController = new SearchController(system);


app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

app.use("/search", searchRoutes(searchController));
app.use("/", createAuthenticationRouter(userController, tokenController));
app.use("/user", createUserGetRouter(userController, tokenController));
app.use("/users", createUserPutRouter(userController, tokenController));
app.use("/posts", createPostRouter(postController,tokenController));


app.listen(port, () => {
    console.log(`✅ Servidor listo`);
});