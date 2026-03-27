<template>
  <div class="ensemble">
    <div class="filter">
      <Filter_form @open="capital_show = true" @search="updateFiltres"/>
    </div>
    <div class="tabilation">
      <div class="tableau">
        <table>
          <thead>
            <tr>
              <th>Nom du produit perdu</th>
              <th>Quantité</th>
              <th>Détails</th>
              <th>Date de perte</th>              
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6">Chargement des données...</td>
            </tr>
            <tr v-else-if="error">
              <td colspan="6" style="color: red;">{{ error }}</td>
            </tr>
            <tr v-else v-for="(item, index) in resultsPertes" :key="index">
              <td>{{ item.produit?.nom || '-' }}</td>
              <td>{{ item.quantite || '-' }}</td>
              <td>{{ item.details || '-' }}</td>
              <td>{{ formatDate(item.date) }}</td>              
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="capital" v-show="capital_show">
    <Dialog_pertes @close="capital_show = false" @perte-added="handlePerteAdded" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Dialog_pertes from "@/components/dialog_pertes.vue";
import Filter_form from "@/components/filter_form.vue";

export default {
    components:{
        Filter_form,
        Dialog_pertes,
    },
    data(){
        return{
            capital_show:false,
            pertes:[],
            loading:true,
            error:null,
            search_query: "",
        }
    },
    computed: {
      resultsPertes() {
        const pertes = this.$store.state.pertes.results

        if (!this.search_query) {
          return pertes || []
        }

        const text = this.search_query

        return pertes.filter((p) => p.produit?.nom?.toLowerCase().includes(text.toLowerCase()) || 
          p.quantite?.toString().includes(text) ||
          p.details?.toLowerCase().includes(text.toLowerCase()) ||
          p.date?.toString().includes(text)
        )
      }
    },
  methods: {
    ...mapActions(["fetchAllPertes"]),

    async loadPertes() {
      this.loading = true;
      this.error = null;
      try {
        await this.fetchPertes();
        this.pertes = this.$store.state.pertes.results || [];
      } catch (e) {
        this.error = "Impossible de charger les pertes.";
      } finally {
        this.loading = false;
      }
    },

    async handlePerteAdded() {
      await this.loadPertes();
      this.capital_show = false;
    },

    updateFiltres(payLoad) {
      this.search_query = payLoad
    }
  },

  async mounted() {
    try {
      await this.fetchAllPertes()
    }catch (e) {
      this.error = "Impossible de charger les pertes"
    }finally{
      this.loading = false
    }
  },
};
</script>

<style src="@/style.css"></style>
