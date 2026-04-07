<template>
  <div v-if="modelValue" class="dialog-overlay" @click.self="closeProfile">
    <div class="dialog-profile">
      <div class="header">
        <h2>Profil du Kiosque</h2>
        <button class="close-btn" @click="closeProfile">&times;</button>
      </div>

      <div class="profile-container">

        <div class="avatar-section">
          <div class="avatar">
            <img :src="$store.state.user?.avatar || '/21.png'" alt="Avatar" />
            <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" style="display: none;">
            <button type="button" class="edit-avatar-btn" @click="$refs.avatarInput.click()">
              <i class="fas fa-camera"></i> Changer l'avatar
            </button>
          </div>
          <div class="user-main-info">
            <h3>{{ $store.state.user.first_name }} {{ $store.state.user.last_name }}</h3>
          </div>
        </div>

        <div class="section">
          <h4 class="section-title">
            <i class="fas fa-store"></i> Informations du Kiosque
          </h4>
          <div class="info-grid" v-for="kiosk, index in $store.state.kiosks.results" :key="kiosk.id">
            <div class="info-item">
              <span class="label">Nom du Kiosque:</span>
              <span class="value">{{ kiosk.name || 'Non spécifié' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Localisation:</span>
              <span class="value">{{ kiosk.address || 'Non spécifiée' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Téléphone:</span>
              <span class="value">{{ kiosk.phone}}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ kiosk.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">R.C:</span>
              <span class="value">{{ kiosk.tp_trade_number }}</span>
            </div>
            <div class="info-item">
              <span class="label">NIF:</span>
              <span class="value">{{ kiosk.tp_TIN }}</span>
            </div>
            <div class="info-item">
              <span class="label">Assujetti à la TVA:</span>
              <span class="value">{{ kiosk.vat_taxpayer == 1 ? "Oui" : "Non" }}</span>
            </div>
            <div class="info-item">
              <span class="label">Centre fiscal:</span>
              <span class="value">{{ kiosk.tp_fiscal_center }}</span>
            </div>
            <div class="info-item">
              <span class="label">Secteur d'activité:</span>
              <span class="value">{{ kiosk.tp_activity_sector }}</span>
            </div>
          </div>
        </div>

      </div>
      <div class="footer">
        <button class="btn-secondary" @click="closeProfile">Fermer</button>
        <button class="btn-secondary" @click="showChangePassword = true">Changer le mot de passe</button>
        <button class="btn-primary" @click="editProfile">Modifier le Profil</button>
      </div>
    </div>

    <DialogChangePassword v-model="showChangePassword" />
  </div>
</template>

<script>
import axios from 'axios'
import DialogChangePassword from './dialog_change_password.vue'

export default {
  name: 'DialogProfile',
  components: {
    DialogChangePassword
  },
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      loading: true,
      avatarUrl: '/21.png',
      showChangePassword: false
    }
  },
  emits: ['update:modelValue', 'edit-profile'],
  
  methods: {
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // console.log('PHOTO LOADED', reader.result)
          this.$store.commit('UPDATE_PROFILE_PHOTO', e.target.result)
          // this.avatarUrl = e.target.result
        }
        reader.readAsDataURL(file)

        this.uploadAvatar(file)
      }
    },
    uploadAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)

      axios
        .patch(`users/${this.$store.state.user.id}/`, formData, this.headers)
        .then(response => {
          this.$store.state.user.avatar = response.data.avatar
          console.log('Avatar uploaded successfully')
        })
        .catch(error => {
          console.error('Avatar upload failed:', error)
        })
    },
    closeProfile() {
      this.$emit('update:modelValue', false)
    },
    editProfile() {
      this.$emit('edit-profile')
      this.closeProfile()
    },
    formatDate(date) {
      if (!date) return 'Non disponible'
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getInfos() {
      this.loading = true

      axios
        .get('kiosks/', this.headers)
        .then(response => {
          this.$store.state.kiosks = response.data
        })
        .catch(error => {
          console.log("AN ERROR OCCURED :", error)          
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.getInfos()
  }
}
</script>

<style scoped src="@/dialog_styles.css"></style>