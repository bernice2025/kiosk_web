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
          />
        </div>

        <button @click="forceSearch">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <div v-if="filteredClients.length > 0" class="results-box">
        <div
          class="result-item"
          v-for="client in filteredClients"
          :key="client.id"
          @click="selectClient(client)"
        >
          {{ client.name || client.customer_name || "Client inconnu" }}
        </div>
      </div>

      <div v-if="clientUUID" class="selected">
        Client sélectionné : <strong>{{ selectedClientName }}</strong>
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
          :max="maxDate"
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
    };
  },

  computed: {
    ...mapState(["clients", "panier"]),

    total() {
      return this.panier.reduce(
        (acc, item) => acc + item.quantity * (item.item.prix?.prix || 0),
        0
      );
    },

    totalTTC() {
      return Math.round(this.total * 1.18);
    },

    filteredClients() {
      if (!this.clientSearch.trim()) return [];
      const search = this.clientSearch.toLowerCase();

      return this.clients.results?.filter((client) =>
        (client.name || client.customer_name || "")
          .toLowerCase()
          .includes(search)
      );
    },
    maxDate() {
      const hier = new Date();
      hier.setDate(hier.getDate() - 1);
      return hier.toISOString().split('T')[0]; // format YYYY-MM-DD
    },
  },

  methods: {
    ...mapActions(["fetchClients", "fetchVentes"]),

    formatNumber(n) {
      return (n || 0).toLocaleString("fr-FR");
    },

    forceSearch() {
      if (!this.clientSearch.trim()) {
        toast.error("Tapez un nom avant de rechercher");
      }
    },

    selectClient(client) {
      this.clientUUID = client.uuid || client.id;
      this.selectedClientName =
        client.name || client.customer_name || "Client inconnu";
      this.clientSearch = this.selectedClientName;
    },

    async effectuerVente() {
      if (this.loading) return;

      this.loading = true;

      if (this.date) {
        const dateChoisie = new Date(this.date);
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0); // minuit aujourd'hui

        if (dateChoisie >= aujourdhui) {
          this.$toast.error("La date de la facture doit être antérieure à aujourd'hui.");
          this.loading = false;
          return;
        }
      }

      const venteData = {
        client: this.clientUUID,
        invoice_type: this.invoiceType,
        date: this.date,
        produits: this.panier.map((p) => ({
          id: p.item.id,
          quantite: p.quantity,
        })),
      };

      try {
        const response = await apiClient.post("ventes/", venteData);
        const venteId = response.data.id;

        const paymentData = {
          vente: venteId,
          montant: this.montantPaye,
          type_paiement: "1", 
          details: "Paiement via formulaire de vente",
          date: this.date,
          currency: "BIF", 
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

  async mounted() {
    try {
      if (!this.clients.results?.length) {
        await this.fetchClients();
      }
    } catch (e) {
      toast.error("Impossible de charger les clients");
    }
  },
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
}

.search {
  width: 90%;
  border-right: 1px solid #ccc;
}

.search input {
  width: 100%;
  padding: 10px;
  border: none;
  background: #eee;
}

.recherche button {
  width: 10%;
  border: none;
  background: #eee;
  cursor: pointer;
}

.results-box {
  border: 1px solid gray;
  height: 30px;
  overflow-y: auto;
  padding: 15px;
  border-radius: 5px;
}

.result-item {
  padding: 10px;
  margin-top: -20px;
  cursor: pointer;
}

.result-item:hover {
  background: #f2f2f2;
}

.invoice-select,
.invoice-ref {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
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
  /* padding: 8px; */
  border-radius: 6px;
  border: 1px solid #ccc;
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