<template>
  <div class="dialog-overlay" @click.self="$emit('closeFacture')" style="font-size: .8rem;">
    <div class="dialog-content">
      <div class="logo-style">
        <img src="/logo.JPG" alt="logo" class="logo" />
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
          
            <p><strong>Invoice Identifier :</strong> {{ vente.invoice_identifier }}</p>
          <br>
          <p><strong>Invoice Date:</strong> {{ formatDate(vente.date) }}</p>
        </div>

        <div class="products-section">
          <h3>Détails des produits :</h3>
          <table class="products-table">
            <thead>
               <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>PU</th>
                <th>PVHTVA</th>
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

        <div class="totals">
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
          // Store kiosk info locally for printing
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
    imprimerFacture() {
        // Get the most up-to-date kiosk info
        const kiosk = this.kioskInfo || (this.$store.state.kiosks.results && this.$store.state.kiosks.results[0]) || {};
        const client = this.vente.client;

        const lignesProduits = this.vente.produits.map(p => `
            <tr>
                <td>${this.escapeHtml(p.nom || '')}</td>
                <td style="text-align:center">${p.quantite || 0}</td>
                <td style="text-align:right">${this.formatNumber(p.prix?.prix)}</td>
                <td style="text-align:right">${this.formatNumber(p.prix?.prix * p.quantite)}</td>
            </tr>
        `).join('');

        const subTotal = this.calculateSubTotal();
        const tva = this.calculateTVA();

        const fenetre = window.open('', '_blank');
        if (!fenetre) {
          console.error("Popup blocked. Please allow popups for this site.");
          alert("Veuillez autoriser les popups pour cette application.");
          return;
        }
        
        fenetre.document.write(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8"/>
                <title>Facture N° ${this.vente.invoice_number}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }

                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        font-size: 13px;
                        color: #1a1a2e;
                        background: #fff;
                        padding: 40px;
                    }

                    /* ── EN-TÊTE ── */
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 36px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #1a1a2e;
                    }
                    .header-left h1 {
                        font-size: 2rem;
                        font-weight: 800;
                        color: #1a1a2e;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                    }
                    .header-left .invoice-id {
                        font-size: 0.85rem;
                        color: #666;
                        margin-top: 4px;
                    }
                    .header-right {
                        text-align: right;
                        line-height: 1.7;
                    }
                    .header-right .company-name {
                        font-size: 1.1rem;
                        font-weight: 700;
                    }
                    .header-right span {
                        display: block;
                        font-size: 0.8rem;
                        color: #555;
                    }

                    /* ── INFOS FACTURE ── */
                    .meta-box {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        gap: 20px;
                    }
                    .meta-card {
                        background: #f7f8fc;
                        border-radius: 8px;
                        padding: 14px 18px;
                        flex: 1;
                        border: 1px solid #e4e6f0;
                    }
                    .meta-card h4 {
                        font-size: 0.7rem;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #999;
                        margin-bottom: 8px;
                    }
                    .meta-card p {
                        font-size: 0.85rem;
                        line-height: 1.7;
                        color: #333;
                    }
                    .meta-card .label {
                        color: #888;
                        font-size: 0.75rem;
                    }

                    /* ── TABLEAU PRODUITS ── */
                    .section-title {
                        font-size: 0.75rem;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        color: #999;
                        margin-bottom: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 24px;
                    }
                    thead tr {
                        background: green !important;
                        color: #ffffff !important;
                    }
                    thead th {
                        padding: 10px 12px;
                        font-size: 0.78rem;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        font-weight: 600;
                        border-right: 1px solid rgba(255,255,255,0.2);
                        background: green !important;
                        color: #ffffff !important;
                    }
                    thead th:last-child {
                        border-right: none;
                    }
                    tbody tr:nth-child(even) { background: #f7f8fc; }
                    tbody tr:nth-child(odd)  { background: #fff; }
                    tbody td {
                        padding: 9px 12px;
                        border-bottom: 1px solid #eee;
                        font-size: 0.85rem;
                    }

                    /* ── TOTAUX ── */
                    .totals-wrapper {
                        display: flex;
                        justify-content: flex-end;
                    }
                    .totals-box {
                        width: 280px;
                        border: 1px solid #e4e6f0;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 9px 16px;
                        font-size: 0.85rem;
                        border-bottom: 1px solid #eee;
                    }
                    .totals-row:last-child { border-bottom: none; }
                    .totals-row.grand {
                        background: gray;
                        color: #fff;
                        font-weight: 700;
                        font-size: 0.95rem;
                    }

                    /* ── PIED DE PAGE ── */
                    .footer {
                        margin-top: 50px;
                        padding-top: 14px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        font-size: 0.75rem;
                        color: #aaa;
                    }
                    
                    @media print {
                        body {
                            padding: 20px;
                        }
                        .meta-card {
                            break-inside: avoid;
                        }
                        table {
                            break-inside: auto;
                        }
                        tr {
                            break-inside: avoid;
                        }
                    }
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        thead tr,
                        thead th {
                            background: green !important;
                            color: #ffffff !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div style="text-align:left; margin-bottom: 20px;">
                    <img src="/logo.JPG" style="width: 150px; height: auto;" />
                </div>
                <!-- EN-TÊTE -->
                <div class="header">
                    <div class="header-left">
                        <h1>Facture</h1>
                        <div class="invoice-id">N° ${this.vente.invoice_number || ''}</div>
                    </div>
                    <div class="header-right">
                        <span class="company-name">${this.escapeHtml(kiosk?.name || '')}</span>
                        <span>${this.escapeHtml(kiosk?.phone || '')} · ${this.escapeHtml(kiosk?.email || '')}</span>
                        <span>${this.escapeHtml(kiosk?.address || '')}</span>
                        <span>NIF : ${this.escapeHtml(kiosk?.tp_TIN || '')}</span>
                        <span>R.C : ${this.escapeHtml(kiosk?.tp_trade_number || '')}</span>
                        <span>Assujetti TVA : ${kiosk?.vat_taxpayer == 1 ? 'Oui' : 'Non'}</span>
                        <span>Centre fiscal : ${kiosk?.tp_fiscal_center}</span>
                        <span>Secteur d'activité : ${kiosk?.tp_activity_sector}</span>
                    </div>
                </div>

                <!-- CARDS META -->
                <div class="meta-box">
                    <div class="meta-card">
                        <h4>Facturé à</h4>
                        <p>
                            <strong>${this.escapeHtml(client?.customer_name || '—')}</strong><br>
                            <span class="label">Tél :</span> ${this.escapeHtml(client?.tel || '—')}<br>
                            <span class="label">NIF :</span> ${this.escapeHtml(client?.customer_TIN || '—')}<br>
                            <span class="label">Adresse :</span> ${this.escapeHtml(client?.customer_address || '—')}<br>
                            <span class="label">Assujetti TVA :</span> ${client?.vat_customer_payer == 1 ? 'Oui' : 'Non'}
                        </p>
                    </div>
                    <div class="meta-card">
                        <h4>Détails de la facture</h4>
                        <p>
                            <span class="label">Date :</span> ${this.formatDate(this.vente.date)}<br>
                            <span class="label">Invoice Identifier :</span> ${this.escapeHtml(this.vente.invoice_identifier || '—')}<br>
                        </p>
                    </div>
                </div>

                <!-- TABLEAU -->
                <p class="section-title">Détails des produits</p>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th style="text-align:center">Quantité</th>
                            <th style="text-align:right">Prix unitaire</th>
                            <th style="text-align:right">PVHTVA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lignesProduits}
                    </tbody>
                </table>

                <!-- TOTAUX -->
                <div class="totals-wrapper">
                    <div class="totals-box">
                        <div class="totals-row">
                            <span>Total PVHTVA</span>
                            <span>${this.formatNumber(subTotal)} BIF</span>
                        </div>
                        <div class="totals-row">
                            <span>TVA (18%)</span>
                            <span>${this.formatNumber(tva)} BIF</span>
                        </div>
                        <div class="totals-row grand">
                            <span>Total TVAC</span>
                            <span>${this.formatNumber(this.vente.prix_total)} BIF</span>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="footer">
                    Merci pour votre confiance &nbsp;·&nbsp; ${this.escapeHtml(kiosk?.name || '')} &nbsp;·&nbsp; ${this.escapeHtml(kiosk?.email || '')}
                </div>

                <script>
                    window.onload = () => { 
                        setTimeout(() => {
                            window.print();
                        }, 500);
                    };
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
</style>