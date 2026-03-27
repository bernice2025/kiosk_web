import { createRouter, createWebHistory } from 'vue-router'

import Accueil from '@/views/Accueil.vue'
import Capital from '@/views/Capital.vue'
import Clienteles from '@/views/Client.vue'
import Depenses from '@/views/Depenses.vue'
import Historiques from '@/views/Historiques.vue'
import Paiements from '@/views/Paiements.vue'
import Pertes from '@/views/Pertes.vue'
import Stocks from '@/views/Stocks.vue'
import Ventes from '@/views/Ventes.vue'
import PointDeVente from '@/views/PointsDeVente.vue'
import Produits from '@/views/Produits.vue'
import Cart from '@/views/Cart.vue'
import Versements from '@/views/Versements.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Accueil', component: Accueil, meta: { label: 'Accueil' } },
    { path: '/capital', name: 'Capital', component: Capital, meta: { label: 'Capital' } },
    { path: '/clienteles', name: 'Clienteles', component: Clienteles, meta: { label: 'Clientèles' } },
    { path: '/depenses', name: 'Depenses', component: Depenses, meta: { label: 'Dépenses' } },
    { path: '/historiques', name: 'Historiques', component: Historiques, meta: { label: 'Historiques' } },
    { path: '/paiements/:id', name: 'Paiements', component: Paiements, props: true, meta: { label: 'Paiements' } },
    { path: '/pertes', name: 'Pertes', component: Pertes, meta: { label: 'Pertes' } },
    { path: '/stocks/:id', name: 'Stocks', component: Stocks, props: true, meta: { label: 'Stocks' } },
    { path: '/ventes', name: 'Ventes', component: Ventes, meta: { label: 'Ventes' } },
    { path: '/point-de-vente', name: 'Point_de_vente', component: PointDeVente, meta: { label: 'Point de vente' } },
    { path: '/produits/all', name: 'Produits', component: Produits, meta: { label: 'Produits' } },
    { path: '/cart', name: 'Cart', component: Cart, meta: { label: 'Panier' } },
    { path: '/versements', name: 'Versements', component: Versements, meta: { label: 'Versements' } },
  ]
})

export default router