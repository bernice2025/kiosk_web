<template>
  <div class="ensemble">
    <div class="filter">
      <Filter_form @open="capital_show = true" />
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stock, index) in filteredStocksProduit" :key="stock.id || index">
              <td>{{ stock?.produit?.nom || '-' }}</td>
              <td>{{ stock?.quantite ?? '-' }}</td>
              <td>{{ formatDate(stock?.date_expiration) || '-' }}</td>
              <td>{{ formatNumber(stock?.prix_achat) || '-' }} <small>FBU</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>                                                                                                   
  <div class="capital" v-show="capital_show">
    <Dialog_stocks
      v-if="produitSelectionne"
      @close="capital_show = false"
      @saved="handleSaved"
    />
  </div>
</template>
                   
<script>
import Dialog_stocks from '@/components/dialog_stocks.vue';
import Filter_form from '@/components/filter_form.vue';
import { mapGetters, mapActions } from 'vuex';

  export default {
    components: {
      Filter_form,
      Dialog_stocks,
    },
    data() {
      return {
        capital_show: false,
      };
    },
    computed: {
      ...mapGetters(['produitSelectionne', 'stocksProduit']),
      filteredStocksProduit() {
        return Array.isArray(this.stocksProduit) ? this.stocksProduit.filter(stock => stock != null) : [];
      }
    },
    methods: {
      ...mapActions(['setProduitSelectionneById', 'fetchStocksProduit']),
      async handleSaved() {
        if (this.produitSelectionne?.id) {
          await this.fetchStocksProduit(this.produitSelectionne.id);
        }
        this.capital_show = false;
      },
                                                                                                                                                                                                                                                                                                                                                                                        
      retourProduits() {
        this.$router.push('/produits');
      },
    },
    async mounted() {
      const produitId = this.$route.params.id;
      if (produitId) {
        await this.setProduitSelectionneById(produitId);
        this.capital_show = false; 
      }
    },
  }
</script>

<style src="@/dialog_styles.css"></style>