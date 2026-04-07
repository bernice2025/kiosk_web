<template>
  <div class="Card">
    <div class="fis">
      <div>Prix total TVA inclus:</div>

      <div class="prix-vente">
        <h2>
          {{ panier.length > 0 ? formatNumber(totalTTC) : 0 }}
          <small>Fbu</small>
        </h2>
      </div>

      <div class="recherche">
        <div class="search">
          <input
            type="text"
            v-model="clientSearch"
            placeholder="Cherchez un client"
            @keyup.enter="forceSearch"
          />
        </div>

        <button 
          v-if="clientSearch" 
          @click="clearSearch"
          title="Réinitialiser"
          class="btn-clear"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <button 
          v-else
          @click="forceSearch"
          :disabled="!clientSearch.trim()"
          title="Rechercher"
        >
          <i v-if="searchLoading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <div v-if="searchResults.length > 0" class="results-box">
        <div
          class="result-item"
          v-for="client in searchResults"
          :key="client.id"
          @click="selectClient(client)"
        >
          {{ client.name || client.customer_name || "Client inconnu" }}
        </div>
      </div>

      <div v-else-if="clientSearch.trim() && !searchLoading && searchResults.length === 0" class="no-results">
        <i class="fa-solid fa-inbox"></i>
        <p>Aucun client trouvé</p>
      </div>

      <div v-if="clientUUID" class="selected">
        <i class="fa-solid fa-check-circle"></i>
        <span>Client confirmé : <strong>{{ selectedClientName }}</strong></span>
      </div>

      <div class="input invoice-select">
        <label>Type de facture</label>
        <select v-model="invoiceType">
          <option disabled value="">-- Choisir un type --</option>
          <option value="FN">Facture normale</option>
          <option value="FA">Facture d’avoir</option>
          <option value="RC">Remboursement caution</option>
          <option value="RH">Réduction hors facture</option>
        </select>
      </div>

      <div class="paie">
        <label for="paie">Montant payé</label>
        <input
          type="number"
          v-model.number="montantPaye"
          id="paie"
          placeholder="Indiquez le montant payé"
          min="0"
        />
      </div>

      <div class="date">
        <label for="date">Date de la creation de la facture</label>
        <input type="date"
          v-model="date"
        >
      </div>

      <div class="number">
        Quantité: <span>{{ panier.length }}</span>
        Bif: <span>{{ formatNumber(total) }}</span>
      </div>
    </div>

    <button class="bouton" @click="effectuerVente" :disabled="loading">
      {{ loading ? 'Traitement...' : 'Effectuer la vente' }}
    </button>
  </div>
</template>

<script>
import apiClient from "@/axios";
import { mapState, mapActions } from "vuex";
import { toast } from "vue3-toastify";
import { debounce } from 'lodash';

export default {
  data() {
    return {
      clientSearch: "",
      clientUUID: "",
      selectedClientName: "",
      invoiceType: "",
      montantPaye: 0,
      date: "",
      dateToday: null,
      loading: false,
      searchLoading: false,
      searchResults: [],
    };
  },

  computed: {
    ...mapState(["panier"]),

    total() {
      return this.panier.reduce(
        (acc, item) => acc + item.quantity * (item.item.prix?.prix || 0),
        0
      );
    },

    totalTTC() {
      return Math.round(this.total * 1.18);
    },

    // filteredClients() {
    //   if (!this.clientSearch.trim()) return [];
    //   const search = this.clientSearch.toLowerCase();

    //   return this.clients.results?.filter((client) =>
    //     (client.name || client.customer_name || "")
    //       .toLowerCase()
    //       .includes(search)
    //   );
    // },

    // maxDate() {
    //   const hier = new Date();
    //   hier.setDate(hier.getDate() - 1);
    //   return hier.toISOString().split('T')[0]; // format YYYY-MM-DD
    // },
  },
  watch: {
    clientSearch(val) {
      if (!val.trim()) {
        this.searchResults = [];
        return;
      }
      this.rechercherClient(val);
    }
  },

  methods: {
    ...mapActions(["fetchVentes"]),

    formatNumber(n) {
      return (n || 0).toLocaleString("fr-FR");
    },
    async rechercherClient(query) {
      this.searchLoading = true;
      try {
        const response = await apiClient.get(`clients/?search=${encodeURIComponent(query)}`);
        this.searchResults = response.data.results || response.data;
      } catch (e) {
        toast.error("Erreur lors de la recherche client");
      } finally {
        this.searchLoading = false;
      }
    },

    forceSearch() {
      if (!this.clientSearch.trim()) {
        toast.error("Tapez un nom avant de rechercher");
      }
    },

    clearSearch() {
      this.clientSearch = "";
      this.searchResults = [];
      this.clientUUID = "";
      this.selectedClientName = "";
    },

    selectClient(client) {
      this.clientUUID = client.uuid || client.id;
      this.selectedClientName = client.name || client.customer_name || "Client inconnu";
      this.clientSearch = this.selectedClientName;
      this.searchResults = [];  // ← ferme la liste
    },

    async effectuerVente() {
      if (this.loading) return;

      this.loading = true;

      // if (this.date) {
      //   const dateChoisie = new Date(this.date);
      //   const aujourdhui = new Date();
      //   aujourdhui.setHours(0, 0, 0, 0); // minuit aujourd'hui

      //   if (dateChoisie >= aujourdhui) {
      //     this.$toast.error("La date de la facture doit être antérieure à aujourd'hui.");
      //     this.loading = false;
      //     return;
      //   }
      // }

      const venteData = {
        client: this.clientUUID,
        invoice_type: this.invoiceType,
        produits: this.panier.map((p) => ({
          id: p.item.id,
          quantite: p.quantity,
        })),
        ...(this.date ? { date: this.date } : {})
      };

      try {
        const response = await apiClient.post("ventes/", venteData);
        const venteId = response.data.id;

        const paymentData = {
          vente: venteId,
          montant: this.montantPaye,
          type_paiement: "1", 
          details: "Paiement via formulaire de vente",
          currency: "BIF", 
          ...(this.date ? { date: this.date } : {})
        };

        await apiClient.post("payments/", paymentData);

        this.$toast.success("Vente et paiement effectués avec succès");

        await this.fetchVentes();

        this.$store.commit("CLEAR_PANIER");

        this.clientUUID = "";
        this.clientSearch = "";
        this.selectedClientName = "";
        this.invoiceType = "";
        this.montantPaye = 0;

        const paidAmount = this.montantPaye;

        this.$router.push({
          name: "Paiements",
          params: { id: venteId },
          query: {
            total: response.data.prix_total || this.totalTTC,
            paye: paidAmount,
          },
        });
      } catch (error) {
        console.error("❌ ERREUR API :", error);
        this.$toast.error(this.$getErrorMessage(error))
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.rechercherClient = debounce(this.rechercherClient, 300);
  },
  // async mounted() {
  //   try {
  //     if (!this.clients.results?.length) {
  //       await this.fetchClients();
  //     }
  //   } catch (e) {
  //     toast.error("Impossible de charger les clients");
  //   }
  // },
};
</script>

<style scoped>
.Card {
  display: flex;
  flex-direction: column;
  gap: 50px;
  /* position: relative; */
}

.recherche {
  display: flex;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.search {
  width: 90%;
  border-right: 1px solid #ccc;
}

.search input {
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font-size: 0.95em;
  outline: none;
}

.search input::placeholder {
  color: #999;
}

.recherche button {
  width: 10%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: #666;
}

.recherche button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.recherche button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  color: #e74c3c;
}

.btn-clear:hover {
  background-color: #ffe6e0 !important;
}

.results-box {
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
  border-radius: 6px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 4px;
}

.result-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.15s;
  border-left: 3px solid transparent;
}

.result-item:hover {
  background: #f8f9fa;
  border-left-color: #3498db;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #999;
  border: 1px dashed #ddd;
  border-radius: 6px;
  background: #fafafa;
  margin-top: 4px;
}

.no-results i {
  font-size: 1.5em;
  margin-bottom: 8px;
  display: block;
}

.no-results p {
  margin: 0;
  font-size: 0.9em;
}

.selected {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  color: #155724;
  font-weight: 500;
  margin-top: 10px;
}

.selected i {
  color: #28a745;
  font-size: 1.2em;
}

.invoice-select,
.invoice-ref {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.invoice-select label,
.invoice-ref label {
  font-weight: 500;
  color: #333;
  font-size: 0.95em;
}

.fis {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 400px;
  overflow-y: auto;
}

.invoice-select select,
.invoice-ref input {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1em;
  width: 100%;
  height: auto;
  min-height: 42px;
}

.bouton {
  margin-top: auto;
  width: 100%;
  max-width: 800px;
}
select {
  padding: 3px;
  font-size: .9em;
}
@media screen and (min-width:768px) and (max-width:1023px){
  .car{
    display: flex;
    flex-direction: column;
  }
}
@media screen and (max-width: 615px) {
  .fis {
    font-size: small;
  }
}
@media screen and (max-width: 470px) {
    .fis {
        font-size: x-small;
    }
    .Card {
      height: calc(100vh - 200px);
    }
}
</style>