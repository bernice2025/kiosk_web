<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="lent">
        <h3>Modifier le prix</h3>
        <button @click="$emit('close')" :disabled="loading">✖</button>
      </div>

      <label>Nouveau prix (FBU)</label>
      <input type="number" v-model.number="nouveauPrix" min="1" />

      <button class="bouton" @click="savePrice" :disabled="loading">
        {{ loading ? "Enregistrement..." : "Enregistrer" }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      nouveauPrix: null,
      loading: false,
    };
  },

  computed: {
    ...mapGetters(["produitSelectionne"]),

    prixListe() {
      return this.produitSelectionne?.prix_historique || [];
    },
  },

  watch: {
    produitSelectionne: {
      immediate: true,
      handler(produit) {
        if (produit && produit.prix && produit.prix.prix) {
          this.nouveauPrix = produit.prix.prix;
        } else {
          this.nouveauPrix = null;
        }
      },
    },
  },

  methods: {
    formatNumber(value) {
      return typeof value === "number" ? value.toLocaleString() : value;
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },

    async savePrice() {
      if (!this.nouveauPrix || this.nouveauPrix <= 0) {
        this.$toast.warning("Le prix doit être supérieur à 0");
        return;
      }

      if (!this.produitSelectionne?.id) {
        this.$toast.error("Produit non sélectionné");
        return;
      }

      this.loading = true;
      try {
        await this.$store.dispatch("createPrixProduit", {
          produitId: this.produitSelectionne.id,
          nouveauPrix: this.nouveauPrix,
        });

        this.$toast.success("Prix ajouté avec succès");
        this.$emit("close");
      } catch (error) {
        console.error(error);
        this.$toast.error("Erreur backend : ajout du prix échoué");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 320px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lent button {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}
</style>