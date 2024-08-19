<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <!-- Imagen de la marca -->
          <img src="@/assets/Icon.png" alt="Logo" class="navbar-logo" />
          FoodMaps
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/mapa">Mapa</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/productos">Productos</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>
  .navbar {
    margin-bottom: 20px;
    margin-top: 0px;
  }
  
  .navbar-logo {
    width: 40px; /* Ajusta el tamaño según sea necesario */
    height: auto; /* Mantiene la proporción de la imagen */
    margin-right: 10px; /* Espaciado entre la imagen y el texto */
    margin-left: 30px;
  }
  </style>
  