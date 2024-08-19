import { createRouter, createWebHistory } from 'vue-router'
import Restaurantes from '../components/Restaurantes.vue'
import Mapa from '../components/MapaRestaurantes.vue'
import Productos from '../components/Productos.vue'


const routes = [
  {
    path: '/',
    name: 'Restaurantes',
    component: Restaurantes
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa
  },
  {
    path: '/productos',
    name: 'Productos',
    component: Productos
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
