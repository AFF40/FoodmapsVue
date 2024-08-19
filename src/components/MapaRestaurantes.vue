<template>
  <div>
    <GMapMap
      :center="mapCenter"
      :zoom="15"
      style="
      width: 50%;
      height: 500px;
      margin: 30px auto;
      "
    >
      <GMapMarker
        v-for="restaurant in restaurantes"
        :key="restaurant.id"
        :position="getLatLng(restaurant.ubicacion)"
        :title="restaurant.nombre"
        @click="selectRestaurant(restaurant, getLatLng(restaurant.ubicacion))"
      />

      <!-- Ventana de información personalizada -->
      <GMapInfoWindow
        v-if="selectedRestaurant"
        :position="selectedPosition"
      >
        <div>
          <h4>{{ selectedRestaurant.nombre }}</h4>
          <button @click="verMenu(selectedRestaurant.id)">Ver Menú</button>
        </div>
      </GMapInfoWindow>
    </GMapMap>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MapaRestaurantes',
  setup() {
    const restaurantes = ref([]);
    const mapCenter = ref({ lat: -17.3848239, lng: -66.1559561 }); 
    const selectedRestaurant = ref(null);
    const selectedPosition = ref(null);
    const router = useRouter();

    const getLatLng = (url) => {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(regex);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        };
      }
      return null;
    };

    onMounted(async () => {
      const response = await fetch('http://localhost:3000/restaurantes');
      const data = await response.json();
      restaurantes.value = data;
    });

    const selectRestaurant = (restaurant, position) => {
      selectedRestaurant.value = restaurant;
      selectedPosition.value = position;
    };

    const verMenu = (restaurantId) => {
      router.push(`/menu/${restaurantId}`);
    };

    return {
      restaurantes,
      mapCenter,
      getLatLng,
      selectedRestaurant,
      selectedPosition,
      selectRestaurant,
      verMenu,
    };
  },
};
</script>

<style>
/* Ocultar el botón de cierre en la ventana de información */
.gm-ui-hover-effect {
  display: none !important;
}

h4 {
  margin: 0;
  font-size: 16px;
}

button {
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
