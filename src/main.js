import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Importa el router
import '@fortawesome/fontawesome-free/css/all.min.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);

app.use(router);  // Usa el router aquí

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDsF6uyrnXvoIENG9pW1clchb6ZhbcwA-8',  // Reemplaza con tu API Key de Google Maps
  },
});

app.mount('#app');  // Monta la aplicación solo una vez


