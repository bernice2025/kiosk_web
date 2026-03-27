<template>
  <div class="container">
  <nav>
    <div class="welcome">
      <h3>
        {{ $store.state.user?.linck || currentMenuLabel || 'Invité' }}
      </h3>
    </div>

    <div class="together">
      <div class="panier" @click="openPage">
        <i class="fa-solid fa-cart-shopping"></i>
      </div>

      <div class="profil" v-if="user" @click="showProfile = true">
        <div class="image">
          <img :src="user?.avatar || '/21.png'" alt="Photo profil" />
        </div>
        <div class="name">
          <h4>{{ user.kiosk_name }}</h4>
          <p>{{ (user.first_name || user.last_name) ? `${user.first_name} ${user.last_name}` 
     : user.username }}</p>
        </div>
      </div>

      <div class="icon">
        <i class="fas fa-chevron-down" @click="show_bar = !show_bar"></i>
      </div>

      <div :class="panierCount > 0 ? 'indepent' : 'indepent-prime'" @click="openPage">
        <p class="paysage">{{ panierCount }}</p>
      </div>

      <div class="hamburger">
        <button class="bouton" @click="toggleMobileMenu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  </nav>

  <div class="second" v-show="show_bar">
    <button class="bouton" @click="logout">Déconnexion</button>
  </div>

  <div class="menu" v-show="open_menu">
    <Menu @closeMenu="open_menu = false" />
  </div>
  </div>
  <DialogProfile v-model="showProfile" @edit-profile="editProfile" />
  
  <DialogDeconnect @closeLogoutDialog="closeDialog" v-if="showDialog" @isLogout="deconnected" @isNotLogout="notDeconnected"/>

  <DialogEditProfile v-model="showEdit"/>

</template>

<script>
import Menu from '@/components/menus.vue'
import DialogProfile from '@/components/dialog_profile.vue'
import DialogDeconnect from '@/components/dialog_deconnexion.vue'
import DialogEditProfile from '@/components/dialog_edit_profile.vue'

export default {
  components: { Menu, DialogProfile, DialogDeconnect, DialogEditProfile },

  data() {
    return {
      show_bar: false,
      open_menu: false,
      showProfile: false,
      showDialog: false,
      showEdit: false
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },
    panierCount() {
      return this.$store.state.panier.length || 0
    },
    userFullName() {
      if (this.user && this.user.first_name && this.user.last_name) {
        return this.user.first_name + ' ' + this.user.last_name
      }
      return ''
    },
    currentMenuLabel() {
        return this.$route.meta.label || 'Invité'
    }
  },
  methods: {
    toggleMobileMenu() {
      this.open_menu = !this.open_menu
      localStorage.setItem('show_menu', this.open_menu)
    },

    logout() {
      this.showDialog = true
    },

    openPage() {
      this.$router.push({ name: 'Cart' })
    },

    editProfile() {
      // alert('Fonctionnalité de modification de profil à venir')
      this.showEdit = true
    },

    closeDialog() {
      this.showDialog = false
    },

    deconnected() {
      this.$store.state.user.id = null;
      localStorage.clear() 
    },

    notDeconnected() {
      this.showDialog = false
      this.show_bar = false
    }
  },
  created() {
    console.log('Utilisateur connecté:', this.user)
    const saved = localStorage.getItem('show_menu')
    if (saved) {
      this.open_menu = saved === 'true'
    }
  },
}
</script>

<style scoped>
nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 3px;
  background: white;
  box-shadow: 0 2px 4px rgb(0, 0, 0, 0.3);
  height: 42px;
}
.welcome {
  font-size: 1rem;
  color: rgb(73, 73, 146);
  margin-top: 5px;
  margin-left: 10px;
}
.name {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.name p {
  font-size: 0.9em;
  margin-top: -3px;
}
.together {
  display: flex;
  gap: 40px;
}
.profil {
  display: flex;
  gap: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.profil:hover {
  opacity: 0.8;
  transform: scale(1.02);
}
.name h4 {
  font-size: large;
}
.panier {
  margin-top: 10px;
  cursor: pointer;
}
.image img {
  width: 30px;
  margin-top: 4px;
}
.name p {
  font-size: small;
  margin-top: -5px;
}
.icon {
  margin-top: 7px;
}
.icon i {
  margin-left: -20px;
}
.indepent {
  position: absolute;
  width: 13px;
  height: 13px;
  background: red;
  border-radius: 50%;
  text-align: center;
  color: white;
  border: 1px solid white;
  margin-left: 10px;
  margin-top: 6px;
  cursor: pointer;
}
.indepent-prime {
  opacity: 0;
  position: absolute;
}
.indepent p {
  font-size: 8px;
}
.second {
  position: absolute;
  box-shadow: 0 2px 4px rgb(0, 0, 0, 0.2);
  width: 240px;
  right: 5px;
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  z-index: 10;
}
.bouton {
  font-size: 12px;
}
.hamburger button {
  width: 50px;
  display: none;
}
@media screen and (max-width: 915px) {
  .hamburger button {
    display: block;
  }
  .profil {
    display: none;
  }
  nav {
    justify-content: none;
    align-items: center;
  }
}
@media screen and (min-width: 916px) {
  .menu {
    display: none;
  }
}
/* .menu {
  position: sticky;
  top: 8%;
  left: 0;
  width: 100%;
  background-color: var(--primary);
  z-index: 100;
  min-height: 100vh;
  overflow-y: auto;
  padding: 10px 0 40px 20px;
} */
</style>