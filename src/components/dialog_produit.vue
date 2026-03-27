<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="layout">
      <div class="card-body">
        <div class="legend">
          <div class="ajout">
            <legend>{{ editMode ? "Modifier un produit" : "Ajouter un produit" }}</legend>
          </div>
          <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
        </div>

        <div class="input">
          <div class="nom">
            <label for="nom">Nom</label>
            <input
              type="text"
              id="nom"
              placeholder="Nom du produit"
              v-model="form.name"
            />
          </div>

          <div class="prix">
            <label for="prix">Prix</label>
            <input
              type="number"
              id="prix"
              placeholder="Prix du produit"
              v-model.number="form.prix"
            />
          </div>
        </div>

        <div class="bt">
          <button class="bouton" @click="saveProduit" :disabled="loading">
            {{ loading ? (editMode ? "Modification..." : "Enregistrement...") : (editMode ? "Modifier" : "Enregistrer") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    produit: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        prix: null,
      },
    };
  },
  watch: {
    produit: {
      immediate: true,
      handler(newVal) {
        if (this.editMode && newVal) {
          this.form.name = newVal.name || "";
          this.form.prix = newVal.prix ?? null;
        } else {
          this.form.name = "";
          this.form.prix = null;
        }
      }
    },
    editMode(newVal) {
      if (!newVal) {
        this.form.name = "";
        this.form.prix = null;
      }
    }
  },
  methods: {
    async saveProduit() {
      if (!this.form.name || this.form.prix === null) {
        this.$toast.warning("Remplis le nom et le prix !");
        return;
      }

      const payload = {
        name: this.form.name,
        prix: this.form.prix,
      };

      try {
        this.loading = true;

        if (this.editMode && this.produit && this.produit.id) {
          await axios.put(`/produits/${this.produit.id}/`, payload);
          this.$toast.success("Produit modifié avec succès !")
        } else {
          await axios.post("/produits/", payload);
          this.$toast.success("Produit ajouté avec succès !")
        }

        this.$emit("saved");
        this.$emit("close");
      } catch (error) {
        console.error("Erreur backend :", error.response?.data || error);
        if(error) {
          this.$toast.warning("Une erreur est survenue lors de l'enregistrement du produit.")
        }
        // this.$toast.warning("❌ Une erreur est survenue lors de l'enregistrement du produit.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style src="@/dialog_style.css" scoped></style>