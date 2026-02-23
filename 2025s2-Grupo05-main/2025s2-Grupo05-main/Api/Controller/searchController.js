import {transformPost, transformSimpleUser} from "../dto.js";

class SearchController {
    constructor(system) {
        this.system = system;
    }

    search = (req, res) => {
        const query = req.query.query;

        const usuariosBuscados = this.system.searchByName(query);
        const postsBuscados = this.system.searchByTag(query);

        const transformListUser = usuariosBuscados.map(usuario => transformSimpleUser(usuario));
        const transformListPost = postsBuscados.map(post => transformPost(post));

        res.json({users: transformListUser, posts: transformListPost});
    }
}

export default SearchController;