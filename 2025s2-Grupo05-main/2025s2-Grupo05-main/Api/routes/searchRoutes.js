import express from 'express';

const createSearchRoutes = (searchController) => {
    const searchRouter = express.Router();
    searchRouter.get('/' , searchController.search);
    return searchRouter;
}

export default createSearchRoutes;

