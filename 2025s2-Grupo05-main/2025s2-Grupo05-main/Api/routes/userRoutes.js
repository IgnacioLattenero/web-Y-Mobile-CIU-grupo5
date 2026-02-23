import express from 'express';

export const createUserGetRouter = (userController, tokenController) => {
    const userRouter = express.Router();
    userRouter.get('/:userId', userController.getUser);
    userRouter.get('/', tokenController.checkRole("user"), userController.getTimeline); 
    return userRouter;
}

export const createUserPutRouter = (userController, tokenController) => {
    const userRouter = express.Router();
    userRouter.put('/:userId/follow', tokenController.checkRole("user"), userController.updateFollow);
    return userRouter;
}
