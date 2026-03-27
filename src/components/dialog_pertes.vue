<template>
  <div class="layout">
    <div class="card-body">
      <div class="legend">
        <div class="ajout">
          <legend>Ajouter une perte</legend>
        </div>
        <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
      </div>

      <div class="input">
        <div class="produit">
          <label>Nom du produit</label>
          <select v-model="form.produit">
            <option disabled value="">-- Sélectionne un produit --</option>
            <option v-for="produit in produitsList" :key="produit.id" :value="produit.id">
              {{ produit.name }}
            </option>
          </select>
        </div>

        <div class="quantite">
          <label>Quantité</label>
          <input type="number" placeholder="Quantité perdue" v-model="form.quantite">
        </div>

        <div class="detail">
          <label>Détails</label>
          <input type="text" placeholder="Détails de la perte" v-model="form.details">
        </div>

        <div class="date">
          <label>Date de perte</label>
          <input type="date" v-model="form.date">
        </div>
      </div>

      <div class="bt">
        <button class="bouton" @click="postInfo" :disabled="loading">
          {{ loading ? "Enregistrement..." : "Enregistrer" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      form: {
        produit: "",
        quantite: "",
        details: "",
        date: ""
      },
    };
  },

  computed: {
    ...mapGetters(["produits"]),
    produitsList() {
      return this.produits.results || [];
    }
  },

  methods: {
    ...mapActions(["ajouterPertesApi", "fetchProduits"]), 

    async postInfo() {
      const payload = {
        produit: this.form.produit,
        quantite: Number(this.form.quantite),
        details: this.form.details,
        date: this.form.date,
      };

      console.log("📤 Payload envoyé:", payload);
      this.loading = true;

      try {
        const res = await this.ajouterPertesApi(payload);
        console.log("✅ Perte enregistrée:", res);

        this.$emit("perte-added"); 
        this.$emit("close");

        if(res) {
          this.$toast.open({
            type: 'success',
            position: 'top',
            message: 'Une perte ajoutée avec succès !'
          })
        }

      } catch (err) {
        console.error("❌ Erreur ajout perte :", err);
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    if (!this.produits.results.length) {
      this.fetchProduits();
    }
  }
};
</script>

<style src="@/dialog_style.css" scoped></style>