<template>
  <div>
    <h1>Restaurantes</h1>
    
    <br>
    <h2>Agregar nuevo Restaurante</h2>

    <form @submit.prevent="crearRestaurante">
      <input v-model="nuevoRestaurante.nombre" placeholder="Nombre del Restaurante" required />
      <br>
      <input v-model="nuevoRestaurante.ubicacion" placeholder="Ubicación" required />
      <br>
      <button type="submit">Agregar Restaurante</button>
    </form>

    <h2>Lista de Restaurantes</h2>
    <!-- Campo de Búsqueda -->
    <input
      v-model="busqueda"
      placeholder="Buscar restaurante por nombre"
      class="buscador"
    />
    <table>
  <thead>
    <tr>
      <th @click="cambiarOrden('nombre')">
        Nombre
        <span v-if="campoOrdenamiento === 'nombre'">
          {{ ordenAscendente ? '▲' : '▼' }}
        </span>
      </th>
      <th @click="cambiarOrden('ubicacion')">
        Ubicación
        <span v-if="campoOrdenamiento === 'ubicacion'">
          {{ ordenAscendente ? '▲' : '▼' }}
        </span>
      </th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="restaurante in restaurantesFiltrados" :key="restaurante.id">
      <td>{{ restaurante.nombre }}</td>
      <td>
        <a :href="restaurante.ubicacion" target="_blank">{{ restaurante.ubicacion }}</a>
      </td>
      <td>
        <button class="btn-espaciado" @click="mostrarFormularioModificacion(restaurante)">Modificar</button>
        <button @click="confirmarEliminacion(restaurante)">Eliminar</button>
      </td>
    </tr>
    <!-- Formulario de Modificación -->
    <tr v-if="restauranteEnEdicion" :key="'edit-' + restauranteEnEdicion.id">
      <td colspan="3">
        <form @submit.prevent="actualizarRestaurante">
          <input v-model="restauranteEnEdicion.nombre" placeholder="Nombre del Restaurante" required />
          <input v-model="restauranteEnEdicion.ubicacion" placeholder="Ubicación" required />
          <button type="submit">Actualizar</button>
          <button @click="cancelarEdicion">Cancelar</button>
        </form>
      </td>
    </tr>
  </tbody>
</table>
    <!-- Modal de Confirmación -->
    <div v-if="mostrarConfirmacion" class="modal" style="display: block !important;">
  <div class="modal-content">
    <h3>Confirmación</h3>
    <p>
      ¿Estás seguro de que deseas eliminar el restaurante {{ restauranteAEliminar ? restauranteAEliminar.nombre : '' }}?
    </p>
    <button @click="eliminarRestauranteConfirmado">Sí, eliminar</button>
    <button @click="cancelarEliminacion">Cancelar</button>
  </div>
</div>


  </div>
</template>


<script>
import { getRestaurantes, createRestaurante, updateRestaurante, deleteRestaurante } from '../services/api';

export default {
  name: 'ListaRestaurantes',
  data() {
    return {
      restaurantes: [],
      nuevoRestaurante: {
        nombre: '',
        ubicacion: '',
      },
      restauranteEnEdicion: null,
      mostrarConfirmacion: false,
      restauranteAEliminar: null,
      busqueda: '',
      campoOrdenamiento: 'nombre', // Campo por el cual ordenar
      ordenAscendente: true // Orden ascendente o descendente
    };
  },
  computed: {
    restaurantesFiltrados() {
      return this.ordenarRestaurantes(
        this.restaurantes.filter(restaurante =>
          restaurante.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
        )
      );
    }
  },
  methods: {
    async fetchRestaurantes() {
      try {
        const response = await getRestaurantes();
        this.restaurantes = response.data;
      } catch (error) {
        console.error("Error fetching restaurantes:", error);
      }
    },
    async crearRestaurante() {
      try {
        await createRestaurante(this.nuevoRestaurante);
        this.nuevoRestaurante = { nombre: '', ubicacion: '' };
        this.fetchRestaurantes();
      } catch (error) {
        console.error("Error creating restaurante:", error);
      }
    },
    async actualizarRestaurante() {
      if (this.restauranteEnEdicion && this.restauranteEnEdicion.id) {
        try {
          await updateRestaurante(this.restauranteEnEdicion.id, this.restauranteEnEdicion);
          this.restauranteEnEdicion = null;
          this.fetchRestaurantes();
        } catch (error) {
          console.error("Error updating restaurante:", error);
        }
      } else {
        console.error("restauranteEnEdicion is undefined or missing id");
      }
    },
    async eliminarRestaurante(id) {
      try {
        await deleteRestaurante(id);
        this.fetchRestaurantes();
      } catch (error) {
        console.error("Error deleting restaurante:", error);
      }
    },
    mostrarFormularioModificacion(restaurante) {
      this.restauranteEnEdicion = { ...restaurante };
    },
    confirmarEliminacion(restaurante) {
  console.log('Restaurante a eliminar:', restaurante);
  this.restauranteAEliminar = restaurante;
  this.mostrarConfirmacion = true;
  console.log('Mostrar confirmación:', this.mostrarConfirmacion);
}
,
    async eliminarRestauranteConfirmado() {
      if (this.restauranteAEliminar && this.restauranteAEliminar.id) {
        await this.eliminarRestaurante(this.restauranteAEliminar.id);
        this.cancelarEliminacion();
      } else {
        console.error("restauranteAEliminar is undefined or missing id");
      }
    },
    cancelarEliminacion() {
      this.mostrarConfirmacion = false;
      this.restauranteAEliminar = null;
    },
    cancelarEdicion() {
      this.restauranteEnEdicion = null;
    },
    cambiarOrden(campo) {
      if (this.campoOrdenamiento === campo) {
        // Si el campo actual es el mismo, invierte el orden
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        // Si el campo es diferente, usa el nuevo campo y establece el orden ascendente
        this.campoOrdenamiento = campo;
        this.ordenAscendente = true;
      }
    },
    // Ordena los restaurantes según el campo y el orden
    ordenarRestaurantes(restaurantes) {
      return restaurantes.slice().sort((a, b) => {
        let resultado = 0;
        if (a[this.campoOrdenamiento] < b[this.campoOrdenamiento]) {
          resultado = -1;
        } else if (a[this.campoOrdenamiento] > b[this.campoOrdenamiento]) {
          resultado = 1;
        }
        return this.ordenAscendente ? resultado : -resultado;
      });
    }
  },
  created() {
    this.fetchRestaurantes();
  }
};
</script>


<style>
h2 {
  margin: 20px 3px;
}

form {
  margin: 10px auto; /* Centra el formulario horizontalmente */
  padding: 10px; /* Espacio interno alrededor del contenido */
  border: 2px solid #000; /* Borde exterior del formulario */
  border-radius: 5px; /* Bordes redondeados */
  background-color: #f9f9f9; /* Color de fondo */
  width: max-content; /* Ajusta el ancho al contenido */
  display: inline-block; /* Evita que el formulario ocupe el ancho completo */
}

input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 5px 0;
}

button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  width: auto;
}

table {
  width: auto;
  border-collapse: collapse;
  margin: 20px auto;
  border: 2px solid #000;
}

th, td {
  padding: 10px;
  border: 2px solid #000 !important; /* Bordes de las celdas */
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.btn-espaciado {
  margin-right: 10px; /* Espaciado entre los botones */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el modal esté encima de otros elementos */
}

/* Contenido del modal */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 500px; /* Ancho máximo del modal */
  width: 90%; /* Ancho del modal ajustado al 90% del contenedor */
  /* Centra el modal horizontalmente y verticalmente */
  position: relative;
  top: 30%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.modal-content button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  width: auto;
}

.buscador {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 300px;
}
</style>

