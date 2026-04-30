<template>
  <div class="vente-card">
    <!-- Header avec total TTC -->
    <div class="total-header">
      <div class="total-label">
        <i class="fa-solid fa-receipt total-icon"></i>
        <span>Total TTC</span>
      </div>
      <div class="total-amount">
        <span class="amount-value">{{ panier.length > 0 ? formatNumber(totalTTC) : '0' }}</span>
        <span class="amount-currency">Fbu</span>
      </div>
      <div class="total-badge">
        <i class="fa-solid fa-tag"></i>
        TVA incluse
      </div>
    </div>

    <!-- Corps du formulaire -->
    <div class="form-body">

      <!-- Section Client -->
      <div class="form-section">
        <div class="section-header">
          <i class="fa-solid fa-user-tie section-icon"></i>
          <span class="section-title">Client</span>
        </div>

        <div class="client-search-section">
          <div class="search-top-row">
            <label class="search-label">Sélectionner un client</label>
            <button class="btn-add-client" @click="showClientDialog = true" type="button">
              <i class="fa-solid fa-plus"></i>
              <span>Nouveau</span>
            </button>
          </div>

          <div class="recherche" :class="{ 'focused': isFocused }">
            <div class="search-inner">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                v-model="clientSearch"
                placeholder="Tapez le nom du client..."
                @keyup.enter="forceSearch"
                @focus="isFocused = true"
                @blur="isFocused = false"
                class="search-input"
              />
              <span v-if="searchLoading" class="loader-spin">
                <i class="fa-solid fa-spinner fa-spin"></i>
              </span>
            </div>

            <button
              v-if="clientSearch"
              @click="clearSearch"
              title="Réinitialiser"
              class="btn-action btn-clear"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            <button
              v-else
              @click="forceSearch"
              :disabled="!clientSearch.trim()"
              title="Rechercher"
              class="btn-action btn-search"
            >
              <i class="fa-solid fa-search"></i>
            </button>
          </div>

          <!-- Résultats -->
          <transition name="drop">
            <div v-if="searchResults.length > 0" class="results-box">
              <div class="results-header">
                <i class="fa-solid fa-list-ul"></i>
                <span>{{ searchResults.length }} résultat(s)</span>
              </div>
              <div
                class="result-item"
                v-for="client in searchResults"
                :key="client.id || client.uuid"
                @click="selectClient(client)"
              >
                <div class="result-avatar">
                  {{ (client.name || client.customer_name || 'C').charAt(0).toUpperCase() }}
                </div>
                <div class="result-content">
                  <div class="result-name">
                    {{ client.name || client.customer_name || 'Client inconnu' }}
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
                <div class="result-arrow">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </transition>

          <transition name="fade">
            <div
              v-if="clientSearch.trim() && !searchLoading && searchResults.length === 0 && !clientUUID"
              class="no-results"
            >
              <i class="fa-solid fa-user-slash no-results-icon"></i>
              <p class="no-results-text">Aucun client trouvé</p>
              <p class="no-results-hint">Vérifiez l'orthographe ou ajoutez un nouveau client</p>
            </div>
          </transition>

          <transition name="slide-up">
            <div v-if="clientUUID" class="selected-client">
              <div class="selected-avatar">
                {{ selectedClientName.charAt(0).toUpperCase() }}
              </div>
              <div class="selected-info">
                <span class="selected-label">Client sélectionné</span>
                <span class="selected-name">{{ selectedClientName }}</span>
              </div>
              <button class="btn-deselect" @click="clearSearch" title="Changer de client">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Section Facture -->
      <div class="form-section">
        <div class="section-header">
          <i class="fa-solid fa-file-invoice section-icon"></i>
          <span class="section-title">Facture</span>
        </div>

        <div class="input-group">
          <label class="input-label">Type de facture</label>
          <div class="select-wrapper">
            <select v-model="invoiceType" class="form-select">
              <option disabled value="">-- Choisir un type --</option>
              <option value="FN">Facture normale</option>
              <option value="FA">Facture d'avoir</option>
              <option value="RC">Remboursement caution</option>
              <option value="RH">Réduction hors facture</option>
            </select>
            <i class="fa-solid fa-chevron-down select-arrow"></i>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="paie">
            <i class="fa-solid fa-coins"></i>
            Montant payé
          </label>
          <div class="input-wrapper">
            <input
              type="number"
              v-model.number="montantPaye"
              id="paie"
              placeholder="0"
              min="0"
              class="form-input"
            />
            <span class="input-suffix">Fbu</span>
          </div>
          <div v-if="montantPaye > 0 && totalTTC > 0" class="montant-info">
            <span v-if="montantPaye >= totalTTC" class="badge badge-success">
              <i class="fa-solid fa-check"></i> Soldé
            </span>
            <span v-else class="badge badge-warning">
              <i class="fa-solid fa-clock"></i>
              Reste : {{ formatNumber(totalTTC - montantPaye) }} Fbu
            </span>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="date">
            <i class="fa-solid fa-calendar-days"></i>
            Date de la facture
          </label>
          <input
            type="date"
            v-model="date"
            id="date"
            class="form-input form-date"
          />
        </div>
      </div>

      <!-- Résumé panier -->
      <div class="cart-summary">
        <div class="summary-item">
          <i class="fa-solid fa-box-open"></i>
          <span class="summary-label">Articles</span>
          <span class="summary-value">{{ panier.length }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <i class="fa-solid fa-money-bill-wave"></i>
          <span class="summary-label">Sous-total HT</span>
          <span class="summary-value">{{ formatNumber(total) }} <small>Fbu</small></span>
        </div>
      </div>
    </div>

    <!-- Bouton vente -->
    <button
      class="btn-vente"
      @click="effectuerVente"
      :disabled="loading"
      :class="{ 'loading': loading }"
    >
      <span v-if="loading" class="btn-content">
        <i class="fa-solid fa-spinner fa-spin"></i>
        Traitement en cours...
      </span>
      <span v-else class="btn-content">
        <i class="fa-solid fa-check-circle"></i>
        Effectuer la vente
      </span>
    </button>
  </div>

  <!-- Dialog Ajouter Client -->
  <DialogAddClientImproved
    :isOpen="showClientDialog"
    @close="showClientDialog = false"
    @success="onClientAdded"
  />
</template>

<script>
import apiClient from "@/axios";
import { mapState, mapActions } from "vuex";
import { toast } from "vue3-toastify";
import { debounce } from 'lodash';
import DialogAddClientImproved from "./dialog_add_client_improved.vue";

export default {
  components: {
    DialogAddClientImproved,
  },
  data() {
    return {
      clientSearch: "",
      clientUUID: "",
      selectedClientName: "",
      invoiceType: "",
      montantPaye: 0,
      date: "",
      loading: false,
      searchLoading: false,
      searchResults: [],
      showClientDialog: false,
      isFocused: false,
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

    rechercherClient(query) {
      this.searchLoading = true;
      let tousLesClients = [];
      let page = 1;

      const chargerPage = () => {
        apiClient.get(`clients/?search=${encodeURIComponent(query)}&page=${page}`)
          .then((response) => {
            let clients = response.data.results || [];
            tousLesClients = tousLesClients.concat(clients);
            if (response.data.next) {
              page++;
              chargerPage();
            } else {
              this.searchResults = tousLesClients;
              this.searchLoading = false;
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Erreur lors de la recherche client");
            this.searchLoading = false;
          });
      };

      chargerPage();
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
      this.searchResults = [];
    },

    async effectuerVente() {
      if (this.loading) return;
      this.loading = true;

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

        const paidAmount = this.montantPaye;
        this.clientUUID = "";
        this.clientSearch = "";
        this.selectedClientName = "";
        this.invoiceType = "";
        this.montantPaye = 0;

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
        this.$toast.error(this.$getErrorMessage(error));
      } finally {
        this.loading = false;
      }
    },

    onClientAdded() {
      this.$toast.success("Nouveau client ajouté avec succès");
    }
  },

  created() {
    this.rechercherClient = debounce(this.rechercherClient, 300);
  },
};
</script>

<style scoped>
/* ============================================================
   BASE & VARIABLES
============================================================ */
:root {
  --primary: #1a56db;
  --primary-light: #e8f0fe;
  --primary-dark: #1240a8;
  --success: #0d9488;
  --success-light: #d1faf5;
  --warning: #d97706;
  --warning-light: #fef3c7;
  --danger: #dc2626;
  --danger-light: #fee2e2;
  --surface: #ffffff;
  --surface-alt: #f8fafc;
  --border: #e2e8f0;
  --border-focus: #1a56db;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04);
  --shadow-lg: 0 10px 40px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   CARD PRINCIPALE
============================================================ */
.vente-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  height: 100%;
  min-height: 0;
}

/* ============================================================
   HEADER TOTAL
============================================================ */
.total-header {
  background: linear-gradient(135deg, #1a56db 0%, #1240a8 50%, #0e3491 100%);
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.total-header::before {
  content: '';
  position: absolute;
  top: -30px; right: -30px;
  width: 120px; height: 120px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}

.total-header::after {
  content: '';
  position: absolute;
  bottom: -20px; left: -20px;
  width: 80px; height: 80px;
  background: rgba(255,255,255,0.04);
  border-radius: 50%;
}

.total-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.75);
  font-size: 0.78em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.total-icon {
  font-size: 1.1em;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.amount-value {
  font-size: clamp(1.6em, 4vw, 2.4em);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  line-height: 1;
}

.amount-currency {
  font-size: 0.85em;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}

.total-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  font-size: 0.72em;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  width: fit-content;
  position: relative;
  z-index: 1;
}

/* ============================================================
   FORM BODY
============================================================ */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* Scrollbar custom */
.form-body::-webkit-scrollbar { width: 6px; }
.form-body::-webkit-scrollbar-track { background: var(--surface-alt); border-radius: 4px; }
.form-body::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }
/* .form-body::-webkit-scrollbar-thumb:hover { background: var(--primary-dark); } */

/* ============================================================
   SECTIONS
============================================================ */
.form-section {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.section-icon {
  width: 28px; height: 28px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.82em;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ============================================================
   RECHERCHE CLIENT
============================================================ */
.client-search-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.search-label {
  font-size: 0.82em;
  font-weight: 600;
  color: var(--text-secondary);
}

.btn-add-client {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-add-client:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26,86,219,0.3);
}

/* Barre de recherche */
.recherche {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-alt);
  transition: all var(--transition);
  overflow: hidden;
}

.recherche.focused {
  border-color: var(--primary);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
}

.search-inner {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  min-width: 0;
}

.search-icon {
  color: var(--text-muted);
  font-size: 0.82em;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.88em;
  color: var(--text-primary);
  outline: none;
  padding: 10px 0;
  min-width: 0;
  font-weight: 500;
}

.search-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.loader-spin {
  color: var(--primary);
  font-size: 0.85em;
  flex-shrink: 0;
}

.btn-action {
  width: 42px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  font-size: 0.9em;
  border-left: 1.5px solid var(--border);
  flex-shrink: 0;
}

.btn-clear {
  color: var(--danger);
}
.btn-clear:hover { background: var(--danger-light); }

.btn-search {
  color: var(--primary);
}
.btn-search:hover:not(:disabled) { background: var(--primary-light); }
.btn-search:disabled { opacity: 0.35; cursor: not-allowed; }

/* Résultats */
.results-box {
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
}

.results-box::-webkit-scrollbar { width: 3px; }
.results-box::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 3px; }

.results-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--primary);
  color: white;
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background var(--transition);
  border-bottom: 1px solid var(--border);
}

.result-item:last-child { border-bottom: none; }

.result-item:hover {
  background: var(--primary-light);
}

.result-avatar {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82em;
  font-weight: 700;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 0.87em;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72em;
  color: var(--text-muted);
}

.result-arrow {
  color: var(--primary);
  font-size: 0.72em;
  opacity: 0.5;
  transition: all var(--transition);
  flex-shrink: 0;
}

.result-item:hover .result-arrow {
  opacity: 1;
  transform: translateX(2px);
}

/* Aucun résultat */
.no-results {
  text-align: center;
  padding: 16px 12px;
  background: var(--surface-alt);
  border-radius: var(--radius-sm);
  border: 1.5px dashed var(--border);
}

.no-results-icon {
  font-size: 1.6em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}

.no-results-text {
  margin: 0 0 3px 0;
  font-size: 0.85em;
  font-weight: 700;
  color: var(--text-secondary);
}

.no-results-hint {
  margin: 0;
  font-size: 0.72em;
  color: var(--text-muted);
}

/* Client sélectionné */
.selected-client {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--success-light);
  border: 1.5px solid var(--success);
  border-radius: var(--radius-sm);
}

.selected-avatar {
  width: 34px; height: 34px;
  background: var(--success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: 700;
  flex-shrink: 0;
}

.selected-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.selected-label {
  font-size: 0.68em;
  font-weight: 700;
  color: var(--success);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-name {
  font-size: 0.88em;
  font-weight: 700;
  color: #065f46;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-deselect {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(13,148,136,0.15);
  color: var(--success);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  transition: all var(--transition);
  flex-shrink: 0;
}

.btn-deselect:hover {
  background: var(--success);
  color: white;
}

/* ============================================================
   INPUTS GROUPES
============================================================ */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.input-group:last-child { margin-bottom: 0; }

.input-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8em;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-label i {
  font-size: 0.9em;
  color: var(--text-muted);
}

/* Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-alt);
  font-size: 0.88em;
  color: var(--text-primary);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition);
}

.form-select:focus {
  border-color: var(--primary);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.75em;
  pointer-events: none;
}

/* Input avec suffix */
.input-wrapper {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all var(--transition);
  background: var(--surface-alt);
}

.input-wrapper:focus-within {
  border-color: var(--primary);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
}

.form-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font-size: 0.88em;
  color: var(--text-primary);
  outline: none;
  font-weight: 500;
  min-width: 0;
}

.input-suffix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--border);
  color: var(--text-secondary);
  font-size: 0.78em;
  font-weight: 700;
  border-left: 1.5px solid var(--border);
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.form-date {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-alt);
  font-size: 0.88em;
  color: var(--text-primary);
  outline: none;
  font-weight: 500;
  transition: all var(--transition);
}

.form-date:focus {
  border-color: var(--primary);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
}

/* Badges montant */
.montant-info {
  display: flex;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72em;
  font-weight: 700;
}

.badge-success {
  background: var(--success-light);
  color: var(--success);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning);
}

/* ============================================================
   RÉSUMÉ PANIER
============================================================ */
.cart-summary {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: var(--surface-alt);
  border-top: 1px solid var(--border);
  gap: 0;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.summary-item i {
  color: var(--text-muted);
  font-size: 0.9em;
  width: 16px;
  text-align: center;
}

.summary-label {
  font-size: 0.78em;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 0.9em;
  font-weight: 700;
  color: var(--text-primary);
  margin-left: auto;
}

.summary-value small {
  font-size: 0.75em;
  font-weight: 500;
  color: var(--text-muted);
}

.summary-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
  margin: 0 16px;
  flex-shrink: 0;
}

/* ============================================================
   BOUTON VENTE
============================================================ */
.btn-vente {
  width: 100%;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1a56db 0%, #0e3491 100%);
  color: white;
  border: none;
  font-size: 0.92em;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  letter-spacing: 0.3px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.btn-vente::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background var(--transition);
}

.btn-vente:hover:not(:disabled)::before {
  background: rgba(255,255,255,0.08);
}

.btn-vente:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(26,86,219,0.4);
}

.btn-vente:active:not(:disabled) {
  transform: translateY(0);
}

.btn-vente:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-vente.loading {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

/* ============================================================
   TRANSITIONS
============================================================ */
.drop-enter-active,
.drop-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ============================================================
   RESPONSIVE
============================================================ */

/* Tablettes paysage et grands écrans */
@media screen and (min-width: 1024px) {
  .total-header {
    padding: 24px 26px 20px;
  }
  .form-section {
    padding: 20px 24px;
  }
  .cart-summary {
    padding: 16px 24px;
  }
  .btn-vente {
    padding: 17px 24px;
    font-size: 0.95em;
  }
}

/* Tablettes portrait */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .vente-card {
    border-radius: var(--radius-md);
  }
  .amount-value {
    font-size: 2em;
  }
  .form-section {
    padding: 16px 18px;
  }
}

/* Petits mobiles */
@media screen and (max-width: 480px) {
  .total-header {
    padding: 16px 16px 14px;
  }
  .amount-value {
    font-size: 1.7em;
  }
  .form-section {
    padding: 14px 14px;
  }
  .cart-summary {
    padding: 12px 14px;
  }
  .btn-vente {
    padding: 14px 16px;
    font-size: 0.88em;
  }
  .section-title {
    font-size: 0.78em;
  }
  .search-label,
  .input-label {
    font-size: 0.76em;
  }
  .summary-label {
    font-size: 0.72em;
  }
  .summary-value {
    font-size: 0.84em;
  }
  .result-name {
    font-size: 0.82em;
  }
  .btn-add-client span {
    display: none;
  }
  .btn-add-client {
    padding: 5px 10px;
  }
}

/* Très petits mobiles */
@media screen and (max-width: 360px) {
  .total-header {
    padding: 14px 14px 12px;
  }
  .amount-value {
    font-size: 1.5em;
  }
  .form-section {
    padding: 12px 12px;
  }
  .summary-divider {
    margin: 0 10px;
  }
}
</style>