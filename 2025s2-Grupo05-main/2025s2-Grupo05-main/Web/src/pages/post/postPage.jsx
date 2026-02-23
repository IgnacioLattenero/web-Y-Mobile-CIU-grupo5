import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './postPage.css';
import Navbar from '../../components/navbar/navbar.jsx';
import { getPostById, deletePostById, toggleLikePost, postComment } from '../../services/api';
import Storage from '../../services/storage';
import Modal from '../../components/modal/modal.jsx'; 


function PostPage() {
    /* 
        ! id de post hardcodeado para probar y el código de como debería ser usando el useParams()
        ! Con react-router hay que ver para cuando se elimina un post
        */
    /* const { id } = useParams();  */
    const id = 'post_9'

    /*
        * contante con función del react-router (TODO) para cuando se eliminen posts.
    */
    const navigate = useNavigate();

    const [post, setPost]               = useState(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked]         = useState(false);
    const [newComment, setNewComment]   = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const postData = await getPostById(id);
                setIsLiked(postData.likes.some(like => like.id === Storage.getUser().id));
                setPost(postData);
            } catch (err) {
                setError("No se pudo cargar el post. Inténtalo de nuevo más tarde.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]); 
    
    if (loading || !post) {
        return <div>Cargando...</div>;
    }

    /* 
    * Lógica que maneja la fecha y usa el string del endpoint.
    */
    const postDate = new Date(post.date);
    const year = postDate.getFullYear();
    const month = postDate.getMonth() + 1;
    const day = postDate.getDate();
    const hours = postDate.getHours();
    const minutes = postDate.getMinutes();
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDateTime = `${year}/${pad(month)}/${pad(day)} - ${pad(hours)}:${pad(minutes)}`;


    /* 
        * Lógica del localStorage para el token y saber si es tu post o no.
        TODO: Funciona hardcodeado el que sea tu post pero no esta testeado con un post ajeno.
    */
    const loggedInUser = Storage.getUser();
    const isOwner = loggedInUser && post && loggedInUser.id === post.user.id;


    if (error) {
        return <div>{error}</div>;
    }

    /* 
        * Handler que "desbloquea" el modal y lo deja visible.
    */
    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    /* 
    * Handler del modal cuando apretas para cerrar sin borrar.
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    /* 
        * Handler para el modal. 
        TODO: agregarle el verdadero navigation y testear que lo borre. 
    */
    const handleDeleteConfirm = async () => {
        try {
            await deletePostById(id);
            console.log("Post eliminado con éxito.");
            navigate('/');
        } catch (error) {
            alert("No se pudo eliminar el post. Inténtalo de nuevo.");
        } finally {
            setIsModalOpen(false);
        }
    }

    /* 
        * Handler para el boton de likes.
    */
    const handleLikeClick = async () => {
        const originalIsLiked = isLiked;
        const originalLikes = [...post.likes];
        setIsLiked(!originalIsLiked);
        if (!originalIsLiked) {
            setPost({ ...post, likes: [...originalLikes, loggedInUser] });
        } else {
            setPost({ ...post, likes: originalLikes.filter(like => like.id !== loggedInUser.id) });
        }
        try {
            await toggleLikePost(id);
        } catch (error) {
            console.error("Falló la operación de 'like'. Revertiendo.");
            setIsLiked(originalIsLiked);
            setPost({ ...post, likes: originalLikes });
        }
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (!newComment.trim()) {
            return;
        }
        try {
            const createdComment = await postComment(id, newComment);
            setPost(createdComment);
            document.getElementById('newCommentText').value = "";
        } catch (error) {
            alert("No se pudo publicar tu comentario. Inténtalo de nuevo.");
        }
    };

    return(
        <div className='display'>
            <div className='navbar'>
                <Navbar />
            </div>
            <div className='postDescription'>
                <div className= "postContainer">
                    <div className = "postImg">
                        <img src={post.image} className="imageP" alt={`Post de ${post.user.name}`}/>
                    </div>
                    <div className='postComment'>
                        <div className='description'>
                            <img className= "userImg imgDesc" src={post.user.image} alt={`Foto de perfil de ${post.user.name}`} />
                            <div className='descriptionText'>
                                <p className='colorP32 styleP'>{post.user.name}</p>
                                <p className='postDate'>{formattedDateTime}</p>
                            </div>
                            {isOwner && (
                                <div className="postActions">
                                    <button className="editButton">
                                        <img src="/Edit.svg" alt="Editar post"/>
                                    </button>
                                    <button onClick={handleDeleteClick} className="deleteButton">
                                        <img src="/Delete.svg" alt="Eliminar post" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='postCommentSection'>
                            {post.description && (
                                <div className='comment-item'> 
                                    <img className="userImg" src={post.user.image} alt={`Foto de perfil de ${post.user.name}`} />
                                    <div className='comment-body'>
                                        <p><strong>{post.user.name}</strong> {post.description}</p>
                                    </div>
                                </div>
                            )}
                            {post.comments.map(comment => (
                                <div key={comment.id} className='comment-item'>
                                    <img className="userImg" src={comment.user.image} alt={`Foto de perfil de ${comment.user.name}`} />
                                    <div className='comment-body'>
                                        <p><strong className='font-semiBold'>{comment.user.name}</strong> {comment.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='publishComment'>
                            <div className='likeAndCommentIcons'>
                                <div className='postLikeIconSection center gap10'>
                                    <button onClick={handleLikeClick} className="btn-img">
                                        {isLiked ? (
                                            <img className="imgIcon" src="/FavoriteFilled.svg" alt="Quitar 'me gusta'." />
                                        ) : (
                                            <img className="imgIcon" src="/Favorite.svg" alt="Dar 'me gusta'." />
                                        )}
                                    </button>
                                    <p className='colorP32 fSize16'>{post.likes.length} Me Gusta</p>
                                </div>
                                <div className='postCommentIconSection center gap10'>
                                    <img className= "imgIcon" src="/Comment.svg" alt="Símbolo de comentarios." />
                                    <p className='colorP32 fSize16'>{post.comments.length} Comentarios</p>
                                </div>
                            </div>
                            <form className='newComment' onSubmit={handleCommentSubmit}>
                                <textarea id="newCommentText" className= "inputText" type="text" placeholder='Agrega un comentario' onChange={(e) => setNewComment(e.target.value)}/>
                                <button className= "publicar" type="submit">Publicar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleDeleteConfirm}>
                <h4>Eliminar Posteo</h4>
                <p>¿Estás seguro que quieres eliminar el post?</p>
            </Modal>
        </div>
    );
}

export default PostPage;