<template>
  <div class="layout">
    <div class="card-body">
      <div class="legend">
        <div class="ajout">
          <legend>Ajouter un capital</legend>
        </div>
        <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
      </div>
      <div class="input">
        <div class="montant">
          <label for="montant">Montant</label>
          <input 
            v-model.number="form.montant" 
            type="number" 
            placeholder="Montant"
          />
        </div>

        <div class="details">
          <label for="details">Détails</label>
          <input 
            v-model.trim="form.details" 
            type="text" 
            placeholder="Détails"
          />
        </div>
      </div>

      <div class="bt">
        <button class="bouton" @click="postInfo" :disabled="loading">
          <span v-if="loading">⏳ Enregistrement...</span>
          <span v-else>Enregistrer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: false,
      form: {
        montant: null,
        details: "",
      },
    };
  },

  methods: {
    async postInfo() {

      this.loading = true;

      try {
        const response = await axios.post("/injections/", {
          montant: this.form.montant,
          details: this.form.details,
        });

        if(response.data) {
          this.$toast.open({
            type: 'success',
            position: 'top',
            message: 'Un capital ajouté avec succès !'
          })
        }

        this.$emit("capital-added", response.data);

        this.$emit("close");
        this.form.montant = null;
        this.form.details = "";

      } catch (err) {
        console.error("Erreur:", err?.response?.data || err);
        alert("Erreur lors de l'ajout du capital.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped src="@/dialog_style.css"></style>