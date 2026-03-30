<template>
    <div>
      <Login v-if="$store.state.user?.id == null"/>
      <div v-else class="conter">
        <div class="gauche" v-if="shown">
          <Menus @openLogoutDialog="openLogoutDialog"/>
        </div>
        <div class="droite">
          <Top_bar/>
          <div class="router">
            <RouterView/>
          </div>
          <span class="close" @click="toggle" v-if="shown" title="Fermer la barre de menu"><i class="far fa-times-circle"></i></span>
          <span v-else class="open" @click="toggle" title="Ouvrir la barre de menu"><i class="fas fa-bars"></i></span>
        </div>
      </div>
      <div v-show="showDialog">
        <Deconnexion @closeLogoutDialog="closeDialog" @isNotLogout="NotLogout" @isLogout="logout"/>
      </div>
    </div>
</template>

<script>
import Login from './components/login.vue';
import Menus from './components/menus.vue';
import Top_bar from './components/top_bar.vue';
import dialog_deconnexion from './components/dialog_deconnexion.vue';
import Stock_chart from './components/vente_chart.vue';

export default {
  components: {
    Login,
    Menus,
    Top_bar,
    Deconnexion: dialog_deconnexion,
    Stock_chart,
  },
  data() {
    return {
      showDialog: false,
      shown: true,
    }
  },
  methods: {
    toggle(){
      this.shown = !this.shown
      localStorage.setItem('menu_open', this.shown)
    },
    logout() {
      this.$store.state.user.id = null
      this.showDialog = false
      alert("Utilisateur déconnecté")
      localStorage.removeItem(user)
    },
    closeDialog() {
      this.showDialog = false
    },
    openLogoutDialog() {
      this.showDialog = true
    },
    NotLogout() {
      this.showDialog = false
    }
  },
  created() {
    const user = localStorage.getItem('user');
    const stock = localStorage.getItem('stocks');
    const client = localStorage.getItem('clients');
    const capital = localStorage.getItem('injections');
    const perte = localStorage.getItem('pertes');
    const depense = localStorage.getItem('depenses');
    const pay = localStorage.getItem('payments');
    const vente = localStorage.getItem('ventes')
    const prod = localStorage.getItem('produits');
    const vers = localStorage.getItem('versements');
    const saved = localStorage.getItem('menu_open');
    this.shown = saved === 'true'
    if (vers) {
      this.$store.commit('SET_VERSEMENTS', JSON.parse(vers))
    }
    if (vente) {
      this.$store.commit('SET_VENTES', JSON.parse(vente))
    }
    if (prod) {
      this.$store.commit('SET_PRODUITS', JSON.parse(prod))
    }
    if (user) {
      this.$store.commit('SET_USER', JSON.parse(user))
    }
    if (stock) {
      this.$store.commit('SET_STOCKS_PRODUITS', JSON.parse(stock))
    }
    if (client) {
      this.$store.commit('SET_CLIENTS', JSON.parse(client))
    }
    if (capital) {
      this.$store.commit('SET_INJECTIONS', JSON.parse(capital))
    }
    if (perte) {
      this.$store.commit('SET_PERTES', JSON.parse(perte))
    }
    if (depense) {
      this.$store.commit('SET_DEPENSES', JSON.parse(depense))
    }
    if (pay) {
      this.$store.commit('SET_PAYMENTS', JSON.parse(pay))
    }
  }
  
}
</script>

<style src="./style.css"></style>