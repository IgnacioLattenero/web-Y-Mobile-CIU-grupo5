import React from 'react';
import './navbar.css'


function Navbar(props) {
  return <nav className='nav'>
  <div>
    <img src="/InstagramIcon.svg" className="image2" alt="instagramIcon" />
  </div>

  <div className="displayColumn">
    <button className="button"  >
      <img src="/Home.svg" className="image" alt="home" />
      Home
    </button>

    <button className="button" >
      <img src="/AddBox.svg" className="image" alt="addBox" />
      Crear Publicación
    </button>
    
    <button className="button" >
      <img src="/react.svg" className="image" alt="perfil" />
      Perfil
    </button>

  </div>

  <div className="button" >
    <img src="/Logout.svg" className="image" alt="instagramIcon" />
    salir
  </div>  

  </nav>;
}

export default Navbar;