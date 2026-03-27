<template>
  <div class="layout">
    <div class="card-body">
      <div class="legend">
        <div class="ajout">
          <legend>Ajouter un stock</legend>
        </div>
        <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
      </div>

      <div class="input">
        <div class="nom">
          <label for="name">Nom du produit</label>
          <input
            type="text"
            id="name"
            v-model="form.nom"
            readonly
          />
        </div>

        <div class="quantite">
          <label for="quantity">Quantité</label>
          <input
            type="number"
            id="quantity"
            v-model.number="form.quantite"
            min="1"
            placeholder="Entrez la quantité"
          />
        </div>

        <div class="date">
          <label for="date">Date d'expiration</label>
          <input
            type="date"
            id="date"
            v-model="form.date_expiration"
          />
        </div>

        <div class="prix">
          <label for="prix">Prix d'achat (FBU)</label>
          <input
            type="number"
            id="prix"
            v-model.number="form.prix_achat"
            min="1"
            placeholder="Entrez le prix d'achat"
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
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DialogStocks',

  computed: {
    ...mapGetters(['produitSelectionne'])
  },

  data() {
    return {
      loading: false,
      form: {
        nom: '',
        quantite: null,
        prix_achat: null,
        date_expiration: ''
      }
    };
  },


  methods: {
    ...mapActions(['ajouterStockApi', 'fetchStocksApi']),

    async postInfo() {
      if (!this.produitSelectionne?.id) {
        this.$toast.warning('Aucun produit sélectionné !');
        return;
      }

      if (!this.form.quantite || !this.form.prix_achat) {
        this.$toast.warning('Veuillez remplir tous les champs obligatoires !');
        return;
      }

      const payload = {
        produit: this.produitSelectionne?.id,
        quantite: Number(this.form.quantite),
        prix_achat: Number(this.form.prix_achat),
        date_expiration: this.form.date_expiration || null
      };

      this.loading = true;
      try {
        await this.ajouterStockApi(payload);

        await this.$store.dispatch("fetchStocksApi", this.produitSelectionne.id);

        this.$toast.success(`Stock ajouté pour ${this.form.nom}`);
        this.$emit('close');
      } catch (error) {
        console.error('Erreur :', error);
        this.$toast.warning('Erreur lors de l’ajout du stock !');
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    console.log('SELECTED PRODUCT : ', this.produitSelectionne)
    if (this.produitSelectionne) {
      this.form.nom = this.produitSelectionne.name || '';
    }
  }
};
</script>

<style scoped src="@/dialog_style.css"></style>
