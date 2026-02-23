export const transformUser = ({id, email, image, followers}) => 
    ({
      id, 
      email, 
      image, 
      followers: followers.map((follower) => ({
        id: follower.id,
        email: follower.email,
        image: follower.image,
      })),
    });

export const transformSimpleUser = ({id, email, image}) => 
    ({
      id, 
      email, 
      image
    });

export const transformPost = ({id, description, image,user,date, likes, comments}) =>
    ({
      id,
      description,
      image,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      date,
      comments: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })),
      likes: likes.map((like) => ({
        id: like.id,
        name: like.name,
        image: like.image,
      })),
    });

export const transformUserWithPost = (user, posts) => 
  ({
    ...user,
    posts: posts.map((post) => transformPost(post)),
  });

