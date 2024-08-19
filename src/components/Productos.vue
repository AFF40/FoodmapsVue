<template>
  <div>
    <h1>Productos</h1>


    <!-- Formulario de Agregar Producto -->
    <form @submit.prevent="guardarProducto">
      <input v-model="nuevoProducto.nombre" placeholder="Nombre del Producto" required />
      <input v-model="nuevoProducto.precio" type="number" placeholder="Precio" required />
      <select v-model="nuevoProducto.tipoId" required>
        <option v-for="tipo in tiposProducto" :key="tipo.id" :value="tipo.id">{{ tipo.tipo }}</option>
      </select>
      <button type="submit">Agregar Producto</button>
    </form>

    <!-- Botones para desplegar formularios -->
    <div class="centered-buttons">
      <button @click="mostrarFormularioTipo = !mostrarFormularioTipo">
        {{ mostrarFormularioTipo ? 'Cancelar' : 'Agregar Nuevo Tipo de Producto' }}
      </button>
      <button @click="mostrarEliminarTipos = !mostrarEliminarTipos">
        {{ mostrarEliminarTipos ? 'Cancelar' : 'Eliminar Tipo de Producto' }}
      </button>
    </div>

    <!-- Formulario de nuevo tipo de producto -->
    <div v-if="mostrarFormularioTipo">
      <h2>Nuevo Tipo de Producto</h2>
      <form @submit.prevent="agregarNuevoTipo">
        <input v-model="nuevoTipo" placeholder="Nombre del Nuevo Tipo" required />
        <button type="submit">Agregar Tipo</button>
      </form>
    </div>

    <!-- Lista de tipos de producto para eliminar -->
    <div v-if="mostrarEliminarTipos">
      <h2>Eliminar Tipo de Producto</h2>
      <ul>
        <li v-for="tipo in tiposProducto" :key="tipo.id">
          {{ tipo.tipo }}
          <button @click="confirmarEliminacionTipo(tipo)">Eliminar</button>
        </li>
      </ul>
    </div>

    <h2>Lista de Productos</h2>
    <!-- Buscador -->
    <input class="buscador" v-model="busqueda" placeholder="Buscar producto por nombre " />
        
<br>
<h4>Buscar por tipo de producto</h4>
<!-- Filtro por tipo -->
<select class="btn_filtro" v-model="filtroTipo">
  <option value="">Todos</option>
  <option v-for="tipo in tiposProducto" :key="tipo.id" :value="tipo.id">{{ tipo.tipo }}</option>
</select>
<br>
<h4>Filtrar por precio</h4>
    <!-- Filtro por precio -->
<select class="btn_filtro" v-model="filtroPrecioTipo">
  <option value="">Todos los precios</option>
  <option value="menor">Menor o igual que</option>
  <option value="mayor">Mayor o igual que</option>
</select>

<input class="btn_filtro" v-model.number="filtroPrecioMonto" type="number" placeholder="Monto" min="0" />
    <table>
      <thead>
        <tr>
          <th @click="ordenarPorCampo('nombre')">
            Nombre
            <span :class="{'arrow': true, 'ascending': ordenPor === 'nombre' && ordenAscendente, 'descending': ordenPor === 'nombre' && !ordenAscendente}"></span>
          </th>
          <th>
            Tipo
          </th>
          <th @click="ordenarPorCampo('precio')">
            Precio
            <span :class="{'arrow': true, 'ascending': ordenPor === 'precio' && ordenAscendente, 'descending': ordenPor === 'precio' && !ordenAscendente}"></span>
          </th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="producto in productosFiltrados" :key="producto.id">
          <td>{{ producto.nombre }}</td>
          <td>{{ getTipoProducto(producto.tipoId) }}</td>
          <td>${{ producto.precio }}</td>

          <td>
            <button @click.stop="editarProducto(producto)">Modificar</button>
            <button @click="confirmarEliminacion(producto)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario de Modificación -->
    <div v-if="productoEnEdicion">
      <h2>Modificar Producto</h2>
      <form @submit.prevent="actualizarProducto">
        <input v-model="productoEnEdicion.nombre" placeholder="Nombre del Producto" required />
        <input v-model="productoEnEdicion.precio" type="number" placeholder="Precio" required />
        <select v-model="productoEnEdicion.tipoId" required>
          <option v-for="tipo in tiposProducto" :key="tipo.id" :value="tipo.id">{{ tipo.tipo }}</option>
        </select>
        <button type="submit">Actualizar</button>
        <button @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <!-- Modal de Confirmación para Productos -->
    <div v-if="mostrarConfirmacion" class="modal">
      <div class="modal-content">
        <h3>Confirmación</h3>
        <p>
          ¿Estás seguro de que deseas eliminar el producto {{ productoAEliminar.nombre }}?
        </p>
        <button @click="eliminarProductoConfirmado">Sí, eliminar</button>
        <button @click="cancelarEliminacion">Cancelar</button>
      </div>
    </div>

    <!-- Modal de Confirmación para Tipos de Producto -->
    <div v-if="mostrarConfirmacionTipo" class="modal">
      <div class="modal-content">
        <h3>Confirmación</h3>
        <p>
          ¿Estás seguro de que deseas eliminar el tipo de producto {{ tipoAEliminar }}?
        </p>
        <button @click="eliminarTipoConfirmado">Sí, eliminar</button>
        <button @click="cancelarEliminacionTipo">Cancelar</button>
      </div>
    </div>
  </div>
</template>


<script>
import { getProductos, createProducto, updateProducto, deleteProducto, getTiposProducto, createTipoProducto } from '../services/api';


export default {
  name: 'ListaProductos',
  data() {
    return {
      productos: [],
      nuevoProducto: {
        nombre: '',
        precio: null,
        tipoId: '',
      },
      tiposProducto: [],
      nuevoTipo: '',
      mostrarFormularioTipo: false,
      mostrarEliminarTipos: false,
      mostrarConfirmacion: false,
      mostrarConfirmacionTipo: false,
      productoEnEdicion: null,
      busqueda: '',
      filtroTipo: "",
      filtroPrecioTipo: '', // Tipo de filtro por precio
      filtroPrecioMonto: null, // Monto para el filtro
      productoAEliminar: null,
      tipoAEliminar: null,
      ordenPor: '',
      ordenAscendente: true,
    };
  },
  computed: {
  productosFiltrados() {
    let filtrados = this.productos;

    // Filtrar por nombre
    if (this.busqueda) {
      filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()));
    }

    // Filtrar por tipo
    if (this.filtroTipo) {
      filtrados = filtrados.filter(p => String(p.tipoId) === String(this.filtroTipo));
    }

    // Filtrar por precio
    if (this.filtroPrecioTipo && this.filtroPrecioMonto !== null) {
      if (this.filtroPrecioTipo === 'menor') {
        filtrados = filtrados.filter(p => p.precio <= this.filtroPrecioMonto);
      } else if (this.filtroPrecioTipo === 'mayor') {
        filtrados = filtrados.filter(p => p.precio >= this.filtroPrecioMonto);
      }
    }

    // Ordenar
    if (this.ordenPor) {
      filtrados = filtrados.sort((a, b) => {
        let aValue = a[this.ordenPor];
        let bValue = b[this.ordenPor];
        
        if (this.ordenPor === 'tipoId') {
          // Si estás ordenando por tipo, usa getTipoProducto para obtener el tipo
          aValue = this.getTipoProducto(a.tipoId);
          bValue = this.getTipoProducto(b.tipoId);
        }

        if (aValue < bValue) return this.ordenAscendente ? -1 : 1;
        if (aValue > bValue) return this.ordenAscendente ? 1 : -1;
        return 0;
      });
    }

    return filtrados;
  }
},
  methods: {
    // Cambiar la ordenación
    ordenarPorCampo(campo) {
    if (this.ordenPor === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenPor = campo;
      this.ordenAscendente = true;
    }
  },

    getTipoProducto(tipoId) {
      const tipo = this.tiposProducto.find(t => t.id === String(tipoId));
      return tipo ? tipo.tipo : 'Tipo desconocido';
    },
    async fetchProductos() {
      const response = await getProductos();
      this.productos = response.data;
    },
    async fetchTiposProducto() {
      try {
        const response = await getTiposProducto();
        this.tiposProducto = response.data;
      } catch (error) {
        console.error('Error al obtener tipos de producto:', error);
      }
    },
    async guardarProducto() {
      await createProducto(this.nuevoProducto);
      this.nuevoProducto = { nombre: '', precio: null, tipoId: '' };
      await this.fetchProductos();
    },
    async agregarNuevoTipo() {
      await createTipoProducto({ tipo: this.nuevoTipo });
      this.nuevoTipo = '';
      await this.fetchTiposProducto();
    },
    async eliminarProductoConfirmado() {
      await deleteProducto(this.productoAEliminar.id);
      this.mostrarConfirmacion = false;
      await this.fetchProductos();
    },
    cancelarEliminacion() {
      this.mostrarConfirmacion = false;
      this.productoAEliminar = null;
    },
    cancelarEliminacionTipo() {
      this.mostrarConfirmacionTipo = false;
      this.tipoAEliminar = null;
    },
    editarProducto(producto) {
      this.productoEnEdicion = { ...producto };
    },
    async actualizarProducto() {
      await updateProducto(this.productoEnEdicion);
      this.productoEnEdicion = null;
      await this.fetchProductos();
    },
    cancelarEdicion() {
      this.productoEnEdicion = null;
    },
    confirmarEliminacion(producto) {
      this.productoAEliminar = producto;
      this.mostrarConfirmacion = true;
    },
    confirmarEliminacionTipo(tipo) {
      this.tipoAEliminar = tipo;
      this.mostrarConfirmacionTipo = true;
    }
  },
  mounted() {
    this.fetchProductos();
    this.fetchTiposProducto();
  },
};


</script>

<style scoped>
/* General */
table {
width: auto; /* Asegura que la tabla ocupe el ancho completo del contenedor */
border-collapse: collapse;
margin: 20px auto;
}

button {
padding: 10px 20px;
margin: 5px;
border: none;
border-radius: 4px;
cursor: pointer;
background-color: #007bff;
color: #fff;
font-size: 16px;
}

button:hover {
background-color: #0056b3;
}

/* Tabla */
th, td {
padding: 12px;
border: 1px solid #ddd;
text-align: left;
}

th {
background-color: #f8f9fa;
position: relative;
cursor: pointer;
}

th:hover {
background-color: #e9ecef;
}

/* Ordenar flechas */
.arrow {
display: inline-block;
width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-top: 5px solid #000;
margin-left: 5px;
vertical-align: middle;
}

.ascending {
border-top: 5px solid #000;
}

.descending {
border-top: 5px solid transparent;
border-bottom: 5px solid #000;
}

/* Modals */
.modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal-content {
background-color: #fff;
padding: 20px;
border-radius: 8px;
text-align: center;
width: 90%;
max-width: 500px;
}

/* Formularios */
form {
display: flex;
flex-direction: column;
gap: 10px;
margin-top: 20px;
align-items: center;
}

form input, form select {
padding: 10px;
border-radius: 4px;
border: 1px solid #ddd;
width: 100%; /* Asegura que los inputs y selects ocupen el ancho completo del formulario */
max-width: 400px; /* Limita el ancho máximo del formulario */
}



input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}
/* Filtro por monto */
input[type="number"] {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  width: calc(100% - 22px); /* Ajusta el ancho considerando el padding y border */
}

/* Botones centrados */
.centered-buttons {
display: flex;
justify-content: center;
gap: 10px; /* Espacio entre los botones */
margin-top: 20px;
}

/* Buscador y Filtro */
.buscador, .btn_filtro {
padding: 10px;
border-radius: 4px;
border: 1px solid #ddd;
margin-bottom: 20px;
width: 100%; /* Asegura que el input de búsqueda y el filtro ocupen el ancho completo del contenedor */
max-width: 400px; /* Limita el ancho máximo */
}

.buscador::placeholder, .btn_filtro {
font-size: 16px;
}
.btn_filtro {
  margin-right: 10px;
  width: auto;
}


</style>
