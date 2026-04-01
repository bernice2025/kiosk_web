<template>
  <div class="ensemble">
    <div class="filter">
      <Filter_form @open="addProductShow = true"  />
    </div>

    <div class="tabilation">
      <div class="tableau">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Date d'expiration</th>
              <th>Prix</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="6">Chargement des données...</td>
            </tr>

            <tr v-else-if="error">
              <td colspan="6" style="color:red">{{ error }}</td>
            </tr>

            <tr
              v-else
              v-for="(item, index) in produitsFiltrés"
              :key="item.id || index"
            >
              <td>{{ item.name }}</td>
              <td>{{ formatNumber(item.quantite) }}</td>
              <td>{{ formatDate(item.created_expiration) }}</td>
              <td>
                {{ formatNumber(item.prix?.prix || 0) }}
                <small>FBU</small>
              </td>

              <td>
                <button class="bouton myButton" @click="voirStock(item)">
                  Stock
                </button>
              </td>

              <td>
                <button class="bouton myButton" @click="openEditPrice(item)">
                  Modifier Prix
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <dialog_edit_price
    v-if="editPriceShow"
    @close="closeEditPrice"
  />

  <div class="capital" v-show="addProductShow">
    <Dialog_produit  @close="addProductShow = false" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Filter_form from "@/components/filter_form.vue";
import dialog_edit_price from "@/components/dialog_edit_price.vue";
import Dialog_produit from "@/components/dialog_produit.vue";

export default {
  components: { Filter_form, dialog_edit_price, Dialog_produit },

  data() {
    return {
      loading: true,
      error: null,
      editPriceShow: false,
      addProductShow: false,
    };
  },

  computed: {
    ...mapGetters(["produits"]),
    produitsFiltrés() {
      return Array.isArray(this.produits?.results) ? this.produits.results : [];
    },
  },

  methods: {
    ...mapActions(["fetchAllProduits", "setProduitSelectionne"]),

    voirStock(produit) {
      this.setProduitSelectionne(produit);
      this.$router.push({ name: "Stocks", params: { id: produit.id } });
    },

    openEditPrice(produit) {
      this.setProduitSelectionne(produit); 
      this.editPriceShow = true;
    },

    closeEditPrice() {
      this.editPriceShow = false;
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },

    formatNumber(value) {
      return typeof value === "number" ? value.toLocaleString() : value;
    },
  },

  async mounted() {
    try {
      await this.fetchAllProduits();
    } catch {
      this.error = "Impossible de charger les produits";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style src="@/style.css"></style>