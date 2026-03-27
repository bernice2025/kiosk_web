<template>
    <div v-if="modelValue" class="dialog-overlay">
        <div class="dialog-profile">
          <h2>Modifier le profil</h2>

          <form @submit.prevent="editer">
            <input v-model="form.kiosk_name" placeholder="Nom du kiosque" />
            <input v-model="form.email" placeholder="Email" />
            <input v-model="form.phone" placeholder="Téléphone" />

            <div class="footer">
              <button type="button" @click="close" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

export default {
  name: 'DialogEditProfile',
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      form: {
        kiosk_name: '',
        email: '',
        phone: ''
      },
      loading: false
    }
  },
  computed: {
    results() {
      return this.$store.state.results
    }
  },
  watch: {
    modelValue(open) {
      if (open && this.results) {
        this.form = { ...this.results }
      }
    }
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false)
    },
    editer() {
      let payLoad = {
        name: this.form.kiosk_name,
        email: this.form.email,
        phone: this.form.phone
      }
      this.loading = true

      axios.put(`kiosks/?${this.$store.state.kiosks.results?.id}/`, payLoad, this.headers)
      .then(res => {
        this.$store.state.kiosks = res.data
        this.close()
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped src="@/dialog_styles.css"></style>