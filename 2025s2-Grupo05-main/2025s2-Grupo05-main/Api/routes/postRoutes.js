import express from 'express';


const createPostRouter = (postController, tokenController) => {
    const postRouter = express.Router();

    postRouter.get('/:postId', postController.getPost);
    postRouter.post('/', tokenController.checkRole("user"), postController.createPost);
    postRouter.post('/:postId/comment', tokenController.checkRole("user") ,postController.updateComment);
    postRouter.put('/:postId', tokenController.checkRole("user") ,postController.updatePost);
    postRouter.put('/:postId/like', tokenController.checkRole("user") ,postController.updateLike);
    postRouter.delete('/:postId', tokenController.checkRole("user") ,postController.deletePost);
    
    return postRouter;
}

export default createPostRouter;