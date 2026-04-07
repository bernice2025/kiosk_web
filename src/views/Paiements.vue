<template>
  <div class="ensemble">
    <div class="fltre">
      <Filter_form @open="nouveauPaiement" @search="updateFilters" />
    </div>
    <div class="tabilation">
      <div class="tableau">
        <table>
          <thead>
            <tr>
              <th>Montant</th>
              <th>Détails</th>
              <th>Date de paiement</th>
              <th>Type de paiement</th>
              <th>Acteur</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="error">
              <td colspan="6" style="color:red">
                Impossible de charger les données.
              </td>
            </tr>
            <tr v-else-if="resultsPayments.length === 0">
              <td colspan="6">Aucune donnée présente.</td>
            </tr>
            <tr v-else v-for="(payment, index) in resultsPayments" :key="index">
              <td>{{ formatNumber(payment.montant) }} {{ payment.currency }}</td>
              <td>{{ payment.details }}</td>
              <td>{{ formatDate(payment.created_at) }}</td>
              <td>{{ payment.type_paiement }}</td>
              <td>{{ payment.created_by.username }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="capital" v-show="dialog_show">
      <Dialog_payments 
        @close="dialog_show = false" 
        @paiement-cree="handlePaiementCree" 
        :venteId="venteId"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Dialog_payments from "@/components/dialog_payments.vue";
import Filter_form from "@/components/filter_form.vue";

export default {
  components: {
    Filter_form,
    Dialog_payments,
  },
  data() {
    return {
      dialog_show: false,
      loading: false,
      error: false,
      payments: [],
      search_query: "",
    };
  },
  computed: {
    venteId() {
      return this.$route.params.id;
    },
    venteTotal() {
      return Number(this.$route.query.total || 0);
    },
    ventePaye() {
      return Number(this.$route.query.paye || 0);
    },
    resultsPayments() {
      const payments = this.payments || [];

      if (!this.search_query) {
        return payments;
      }

      const text = this.search_query.toLowerCase();

      return payments.filter(
        (p) =>
          p.montant?.toString().includes(text) ||
          p.details?.toLowerCase().includes(text) ||
          p.type_paiement?.toLowerCase().includes(text) ||
          p.created_at?.toString().includes(text)
      );
    },
  },
  methods: {
    getData() {
      this.loading = true;
      axios
        .get(`payments/?vente=${this.venteId}`)
        .then((response) => {
          this.payments = response.data.results;
          this.error = false;
        })
        .catch((error) => {
          console.error("AN ERROR OCCURED: ", error);
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    nouveauPaiement() {
      if (this.venteTotal === this.ventePaye) {
        this.dialog_show = false;
        alert("Paiement déjà effectué");
      } else {
        this.dialog_show = true;
      }
    },
    updateFilters(payload) {
      this.search_query = payload;
    },
    handlePaiementCree() {
      this.getData(); 
      this.dialog_show = false;
    }
  },
  mounted() {
    this.getData();
  },
};
</script>

<style src="@/style.css"></style>