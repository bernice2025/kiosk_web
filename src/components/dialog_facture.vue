<template>
  <div class="dialog-overlay" @click.self="$emit('closeFacture')" style="font-size: .8rem;">
    <div class="dialog-content">
      <div class="logo-style">
        <img src="/logo-hogi-updated.png" alt="logo" class="logo" />
        <i class="fa-solid fa-xmark" @click="$emit('closeFacture')"></i>  
      </div>
      <div class="dialog-header logo-header">
        <h2>Facture N° {{ vente.invoice_number }}</h2>      
      </div>
      <div class="body">
        <div class="client-company">
          <div class="client">
              <h4>Facturé à</h4>
              <h3>{{ vente.client.customer_name }}</h3>
              <span>Téléphone : {{ vente.client.tel }}</span>
              <span>NIF : {{ vente.client.customer_TIN || '--' }}</span>
              <span>Adresse : {{ vente.client.customer_address }}</span>
              <span>Assujetti à la TVA : {{ vente.client.vat_customer_payer == 1 ? "Oui" : "Non" }}</span>
          </div>
          <div class="company">
              <h3>{{ kioskInfo?.name || $store.state.kiosks.results?.[0]?.name }}</h3>
              <span>{{ kioskInfo?.phone || $store.state.kiosks.results?.[0]?.phone }} - {{ kioskInfo?.email || $store.state.kiosks.results?.[0]?.email }}</span>
              <span>
                {{ kioskInfo?.address || $store.state.kiosks.results?.[0]?.address }}
              </span>
              <span>
                NIF : {{ kioskInfo?.tp_TIN || $store.state.kiosks.results?.[0]?.tp_TIN }}
              </span>
              <span>
                R.C: {{ kioskInfo?.tp_trade_number || $store.state.kiosks.results?.[0]?.tp_trade_number }}
              </span>
              <span>
                Assujetti à la TVA : {{ (kioskInfo?.vat_taxpayer || $store.state.kiosks.results?.[0]?.vat_taxpayer) == 1 ? "Oui" : "Non" }}
              </span>
              <span>
                Centre fiscal : {{ $store.state.kiosks.results[0]?.tp_fiscal_center }}
              </span>
              <span>
                Secteur d'activité : {{ $store.state.kiosks.results[0]?.tp_activity_sector }}
              </span>
          </div>
        </div>
      <div class="dialog-body">
        <div class="facture-info">
          
            <p><strong>Invoice identifier:</strong> {{ vente.invoice_identifier }}</p>
          <br>
          <p><strong>Date:</strong> {{ formatDate(vente.date) }}</p>
        </div>

        <div class="products-section">
          <h3>Détails des produits :</h3>
          <table class="products-table">
            <thead>
               <tr>
                <th>Description</th>
                <th>Qté</th>
                <th>Prix</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produit in vente.produits" :key="produit.id">
                <td>{{ produit.nom }}</td>
                <td>{{ produit.quantite }}</td>
                <td>{{ formatNumber(produit.prix?.prix) }}</td>
                <td>{{ formatNumber(produit.prix?.prix * produit.quantite) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="totals-section">
          <div class="total-line">
            <span>Total PVHTVA:</span>
            <span>{{ formatNumber(calculateSubTotal()) }}</span>
          </div>
          <div class="total-line">
            <span>TVA:</span>
            <span>{{ formatNumber(calculateTVA()) }}</span>
          </div>
          <div class="total-line grand-total">
            <span>Total TVAC:</span>
            <span>{{ formatNumber(vente.prix_total) }}</span>
          </div>
        </div>

      </div>
      </div>
      <div class="monBouton">
        <button class="button" @click="imprimerFacture">Imprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    vente: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      kioskInfo: null,
      headers: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
        }
      }
    };
  },
  methods: {
    calculateSubTotal() {
      return this.vente.produits.reduce((total, produit) => 
        total + (produit.prix?.prix * produit.quantite), 0)
    },
    calculateTVA() {
      return this.calculateSubTotal() * 0.18
    },
    formatNumber(value) {
      if (value === undefined || value === null) return '0';
      return new Intl.NumberFormat('fr-FR').format(Math.round(value));
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getData() {
      this.loading = true
      axios
        .get('ventes/', this.headers)
        .then((response) => {
          if (this.$store.state.ventes) {
            this.$store.state.ventes = response.data
          }
        })
        .catch((error) => {
          console.error("AN ERROR OCCURED: ", error.response?.data)
        })
        .finally(() => {
          this.loading = false
        });
    },
    getKiosks() {
      this.loading = true
      axios
        .get('kiosks/', this.headers)
        .then((response) => {
          if (this.$store.state.kiosks) {
            this.$store.state.kiosks = response.data
          }
          if (response.data.results && response.data.results.length > 0) {
            this.kioskInfo = response.data.results[0];
          }
        })
        .catch((error) => {
          console.log("ERROR :", error.response?.data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    numberToWords(num) {
      if (num === 0) return "zéro";
      
      const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
      const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
      
      if (num < 20) return units[num];
      
      if (num < 100) {
        let ten = Math.floor(num / 10);
        let unit = num % 10;
        
        if (ten === 7) {
          return "soixante-" + (unit === 1 ? "onze" : units[10 + unit]);
        }
        if (ten === 8) {
          return unit === 0 ? "quatre-vingts" : "quatre-vingt-" + units[unit];
        }
        if (ten === 9) {
          return "quatre-vingt-" + (unit === 1 ? "onze" : units[10 + unit]);
        }
        
        return tens[ten] + (unit ? "-" + units[unit] : "");
      }
      
      if (num < 1000) {
        let hundred = Math.floor(num / 100);
        let rest = num % 100;
        
        let result = hundred === 1 ? "cent" : units[hundred] + " cent";
        if (rest > 0) {
          result += " " + this.numberToWords(rest);
        } else if (hundred > 1) {
          result += "s";
        }
        return result;
      }
      
      if (num < 1000000) {
        let thousand = Math.floor(num / 1000);
        let rest = num % 1000;

        let result = thousand === 1 ? "mille" : this.numberToWords(thousand) + " mille";
        if (rest > 0) {
          result += " " + this.numberToWords(rest);
        }
        return result;
      }

      if (num < 1000000000) {
        let million = Math.floor(num / 1000000);
        let rest = num % 1000000;

        let result = million === 1 ? "un million" : this.numberToWords(million) + " millions";

        if (rest > 0) {
          result += " " + this.numberToWords(rest);
        }

        return result;
      }

return num.toString();
      
      return num.toString();
    },
    imprimerFacture() {
        const kiosk = this.kioskInfo || (this.$store.state.kiosks.results && this.$store.state.kiosks.results[0]) || {};
        const client = this.vente.client;

        const lignesProduits = this.vente.produits.map(p => `
          <tr>
            <td>${this.escapeHtml(p.nom || '')}</td>
            <td>${p.quantite || 0}</td>
            <td>${this.formatNumber(p.prix?.prix)}</td>
            <td>${this.formatNumber(p.prix?.prix * p.quantite)}</td>
          </tr>
        `).join('');

        const subTotal = this.calculateSubTotal();
        const tva = this.calculateTVA();

        const fenetre = window.open('', '_blank');
        if (!fenetre) {
          alert("Veuillez autoriser les popups pour cette application.");
          return;
        }
        
        fenetre.document.write(`
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8"/>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                font-size: 12px;
              }
              .facture-container {
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding-bottom: 10px;
                border-bottom: 2px solid #000;
              }
              .logo img { width: 120px; }
              .company-info { text-align: right; }
              .title { 
                text-align: center; 
                margin: 20px 0;
              }
              .title h1 { font-size: 18px; }
              .client-section, .offer-section {
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              th { background: green !important; color: white !important }
              .totals {
                text-align: right;
                margin: 20px 0;
              }
              .totals div { margin: 5px 0; }
              .payment-instructions, .note {
                margin: 20px 0;
                padding: 10px;
              }
              .signature {
                margin-top: 40px;
                text-align: right;
              }
              .amount-words {
                margin-top: 20px;
                font-style: italic;
              }
              hr {
                margin: 10px 0;
                border: none;
                border-top: 1px solid #ccc;
              }
              @media print {
                th {
                  background-color: green !important;
                  color: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="facture-container">
              <!-- Ligne comme dans le PDF -->
              <hr>
              <hr>
              
              <div class="header">
                <div class="logo">
                  <img src="${window.location.origin}/logo-hogi-updated.png" />
                </div>
                <div class="company-info">
                  <strong>${this.escapeHtml(kiosk?.name || '')}</strong><br>
                  ${this.escapeHtml(kiosk?.phone || '')}<br>
                  ${this.escapeHtml(kiosk?.address || '')}<br>
                  NIF : ${this.escapeHtml(kiosk?.tp_TIN || '')}<br>
                  RC : ${this.escapeHtml(kiosk?.tp_trade_number)}<br>
                  Assujeti à la TVA : ${this.escapeHtml(kiosk?.vat_taxpayer == 1 ? 'Oui' : 'Non')}<br>
                  Centre fiscal : ${this.escapeHtml(kiosk?.tp_fiscal_center)}<br>
                  Secteur d'activité : ${this.escapeHtml(kiosk?.tp_activity_sector)}<br>
                  Invoice identifier : ${this.escapeHtml(this.vente.invoice_identifier)}
                </div>
              </div>

              <!-- Ligne comme dans le PDF -->
              <hr>
              <hr>

              <div class="title">
                <h1>FACTURE</h1>
              </div>

              <div class="client-section">
                <p><strong>Facturé à</strong><br>
                ${this.escapeHtml(client?.customer_name || '—')}<br>
                NIF: ${this.escapeHtml(client?.customer_TIN || '—')}<br>
                Adresse: ${this.escapeHtml(client?.customer_address || '—')}<br>
                Assujetti à la TVA: ${client?.vat_customer_payer == 1 ? 'Oui' : 'Non'}</p>
              </div>

              <div class="offer-section">
                <p><strong>Offre : </strong> ${this.vente.invoice_number}<br>
                Date: ${this.formatDate(this.vente.date)}</p>
              </div>

              <!-- Ligne comme dans le PDF -->
              <hr>

              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qté</th>
                    <th>Prix</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  ${lignesProduits}
                </tbody>
              </table>

              <!-- Ligne comme dans le PDF -->
              <hr>

              <div class="totals">
                <div>Total PVHTVA: ${this.formatNumber(subTotal)} BIF</div>
                <div>TVA: ${this.formatNumber(tva)} BIF</div>
                <div><strong>Total TVAC: ${this.formatNumber(this.vente.prix_total)} BIF</strong></div>
              </div>

              <div class="amount-words">
                <p><strong>Nous disons :</strong> ${this.numberToWords(Math.round(this.vente.prix_total))} francs burundais</p>
              </div>

              <!-- Ligne comme dans le PDF -->
              <hr>

              <div class="payment-instructions">
                <h4>## Instructions de payement</h4>
                <p>
                  Vous pouvez payer via chèque/Virement au compte : 60115520001 ouvert à la BBCI au nom de HOGI<br>
                  Vous pouvez aussi nous appeler et nous prendrons le payement en cash/Ecocash/Lumicash : 79542855/69265616 : Innocent Sangwe
                </p>
              </div>

              <!-- Ligne comme dans le PDF -->
              <hr>

              <div class="signature">
                <p>${this.formatDate(this.vente.date)}</p>
                <p>Signature du client : _________________________</p>
              </div>
              <br><br>
              <!-- Lignes comme dans le PDF -->
              <hr>
              <hr>
            </div>

            <script>
              window.onload = () => { setTimeout(() => window.print(), 500); };
            <\/script>
          </body>
          </html>
        `);
        fenetre.document.close();
    },
    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  },
  mounted() {
    this.getData();
    this.getKiosks();
  }
}
</script>

<style src="@/dialog_style.css" scoped></style>

<style scoped>
.logo-style {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  width: 120px;
}
.payment-section, .note-section {
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.date-signature {
  margin-top: 30px;
  text-align: right;
}
.amount-in-words {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
}
hr {
  margin: 10px 0;
}
</style>