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

      <div class="client-search-section">
        <label class="search-label">Sélectionner un client</label>
        <div class="recherche">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              v-model="clientSearch"
              placeholder="Tapez le nom du client..."
              @keyup.enter="forceSearch"
              class="search-input"
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
            class="btn-search"
          >
            <i v-if="searchLoading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-search"></i>
          </button>
        </div>

        <div v-if="searchResults.length > 0" class="results-box">
          <div class="results-header">
            <span class="results-count">{{ searchResults.length }} résultat(s)</span>
          </div>
          <div
            class="result-item"
            v-for="client in searchResults"
            :key="client.id || client.uuid"
            @click="selectClient(client)"
          >
            <div class="result-icon">
              <i class="fa-solid fa-user-circle"></i>
            </div>
            <div class="result-content">
              <div class="result-name">
                {{ client.name || client.customer_name || "Client inconnu" }}
              </div>
              <div class="result-meta" v-if="client.phone || client.email">
                <span v-if="client.phone" class="meta-item">
                  <i class="fa-solid fa-phone"></i> {{ client.phone }}
                </span>
                <span v-if="client.email" class="meta-item">
                  <i class="fa-solid fa-envelope"></i> {{ client.email }}
                </span>
              </div>
            </div>
            <div class="result-select">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div v-else-if="clientSearch.trim() && !searchLoading && searchResults.length === 0" class="no-results">
          <div class="no-results-icon">
            <i class="fa-solid fa-inbox"></i>
          </div>
          <p class="no-results-text">Aucun client trouvé</p>
          <p class="no-results-hint">Vérifiez l'orthographe du nom</p>
        </div>
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

/* Client Search Section */
.client-search-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recherche {
  display: flex;
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.recherche:focus-within {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
}

.search {
  width: 85%;
  border-right: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding-left: 8px;
  position: relative;
}

.search-icon {
  color: #95a5a6;
  margin-right: 6px;
  font-size: 0.8em;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  font-size: 0.9em;
  outline: none;
  color: #2c3e50;
  font-weight: 500;
}

.search-input::placeholder {
  color: #bdc3c7;
  font-weight: 400;
}

.recherche button {
  width: 15%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #7f8c8d;
  font-size: 0.95em;
}

.recherche button:hover:not(:disabled) {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.recherche button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-clear {
  color: #e74c3c;
}

.btn-clear:hover {
  background-color: #fadbd8;
  color: #c0392b;
}

.btn-search {
  color: #3498db;
}

.btn-search:hover:not(:disabled) {
  background-color: #d6eaf8;
  color: #2980b9;
}

/* Results Box */
.results-box {
  border: 2px solid #3498db;
  max-height: 350px;
  overflow-y: auto;
  border-radius: 6px;
  background: white;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-header {
  padding: 8px 12px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #2980b9;
}

.results-count {
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.result-item {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
  padding-left: 16px;
}

.result-icon {
  flex-shrink: 0;
  font-size: 1.1em;
  color: #3498db;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9em;
}

.result-meta {
  display: flex;
  gap: 10px;
  font-size: 0.75em;
  color: #7f8c8d;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.meta-item i {
  color: #95a5a6;
  font-size: 0.75em;
}

.result-select {
  flex-shrink: 0;
  color: #3498db;
  font-size: 0.8em;
  opacity: 0;
  transition: all 0.2s ease;
}

.result-item:hover .result-select {
  opacity: 1;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 20px 15px;
  color: #7f8c8d;
  border: 2px dashed #bdc3c7;
  border-radius: 6px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.no-results-icon {
  font-size: 2em;
  margin-bottom: 8px;
  color: #bdc3c7;
}

.no-results-text {
  margin: 0 0 3px 0;
  font-weight: 600;
  color: #34495e;
  font-size: 0.9em;
}

.no-results-hint {
  margin: 0;
  font-size: 0.75em;
  color: #95a5a6;
}

.selected {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #d4edda 0%, #c8e6c9 100%);
  border: 2px solid #28a745;
  border-radius: 6px;
  color: #155724;
  font-weight: 600;
  font-size: 0.9em;
  margin-top: 8px;
  animation: slideDown 0.3s ease;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.15);
}

.selected i {
  color: #28a745;
  font-size: 1.1em;
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