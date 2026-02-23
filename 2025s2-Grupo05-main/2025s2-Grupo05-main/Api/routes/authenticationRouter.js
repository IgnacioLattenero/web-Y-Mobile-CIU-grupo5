import express from "express";

const createAuthenticationRouter = (userController, tokenController) => {
    const authenticationRouter = express.Router();
    authenticationRouter.post('/login', tokenController.checkRole("public"), userController.login);
    authenticationRouter.post('/register', tokenController.checkRole("public"), userController.register);
    return authenticationRouter;

}

export default createAuthenticationRouter;