<template>
    <div class="ensemble">
        <div class="form">
            <Filter_form @search="updateFiltres" />
        </div>

        <div class="tabilation">
            <div class="tableau">
                <table>
                    <thead>
                        <tr>
                            <th>Créé par</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Montant payé</th>
                            <th>Prix total</th>
                            <th>Status</th>
                            <th>Options</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="loading">
                            <td colspan="7" class="state-message loading">
                                <i class="fa-solid fa-spinner fa-spin"></i>
                                Chargement des ventes en cours...
                            </td>
                        </tr>

                        <tr v-else-if="error">
                            <td colspan="7" class="state-message error">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                {{ error }}
                            </td>
                        </tr>

                        <tr v-else-if="resultsVentes.length === 0">
                            <td colspan="7" class="state-message empty">
                                <i class="fa-solid fa-box-open"></i>
                                Aucune vente trouvée.
                            </td>
                        </tr>

                        <tr 
                            v-for="vente in resultsVentes" 
                            :key="vente.id"
                        >
                            <td>{{ vente?.created_by?.username || "—" }}</td>
                            <td>{{ vente?.client?.customer_name || "—" }}</td>
                            <td>{{ formatDate(vente?.created_at) }}</td>
                            <td>{{ formatNumber(vente?.payee) }}</td>
                            <td>{{ formatNumber(vente?.prix_total) }}</td>
                            <td class="text-center">
                                <span v-if="vente.synced === true && vente.is_cancelled === true"
                                    style="background:#fee2e2; color:#dc2626; padding:3px 10px; border-radius:999px; font-size:0.78rem; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                                    <i class="fa-solid fa-ban"></i> Annulée
                                </span>
                                <span v-else-if="vente.synced === true"
                                    style="background:#dcfce7; color:#16a34a; padding:3px 10px; border-radius:999px; font-size:0.78rem; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                                    <i class="fa-solid fa-circle-check"></i> Envoyée OBR
                                </span>
                                <span v-else
                                    style="background:#f1f5f9; color:#94a3b8; padding:3px 10px; border-radius:999px; font-size:0.78rem; font-weight:600; display:inline-flex; align-items:center; gap:5px;">
                                    <i class="fa-solid fa-clock"></i> En attente
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="dropdown-wrapper">
                                    <button 
                                        class="btn-icon" 
                                        :class="{ 'btn-icon--active': activeDropdown === vente.id }"
                                        @click="toggleDropdown(vente, $event)"
                                    >
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Dialog_facture 
        v-if="show_table"
        :vente="selectedVente"
        @closeFacture="show_table = false"
    />

    <Teleport to="body">
        <template v-if="activeDropdown !== null">
            <div 
                class="histo-dropdown"
                :style="dropdownStyle"
            >
                <!-- Flèche décorative -->
                <div class="histo-dropdown__arrow"></div>

                <div class="histo-dropdown__body">
                    <button 
                        class="histo-dropdown__item histo-dropdown__item--facture"
                        @click="openFactures(selectedDropdownVente); activeDropdown = null"
                    >
                        <span class="histo-dropdown__icon">
                            <i class="fa-solid fa-file-invoice"></i>
                        </span>
                        <span class="histo-dropdown__text">
                            <span class="histo-dropdown__title">Facture</span>
                            <span class="histo-dropdown__sub">Voir la facture</span>
                        </span>
                        <i class="fa-solid fa-chevron-right histo-dropdown__arrow-right"></i>
                    </button>

                    <div class="histo-dropdown__divider"></div>

                    <button 
                        class="histo-dropdown__item histo-dropdown__item--payment"
                        @click="openPayment(selectedDropdownVente); activeDropdown = null"
                    >
                        <span class="histo-dropdown__icon">
                            <i class="fa-solid fa-money-bill-wave"></i>
                        </span>
                        <span class="histo-dropdown__text">
                            <span class="histo-dropdown__title">Paiements</span>
                            <span class="histo-dropdown__sub">Gérer les paiements</span>
                        </span>
                        <i class="fa-solid fa-chevron-right histo-dropdown__arrow-right"></i>
                    </button>

                    <div class="histo-dropdown__divider"></div>

                    <button 
                        class="histo-dropdown__item histo-dropdown__item--envoyer_obr"
                        @click="envoyerObr(selectedDropdownVente); activeDropdown = null"
                        v-if="selectedDropdownVente?.synced === false"
                    >
                        <!-- <span class="histo-dropdown__icon">
                            <i class="fa-solid fa-money-bill"></i>
                        </span> -->
                        <span class="histo-dropdown__text">
                            <span class="histo-dropdown__title envoi-obr">Envoyer à l'OBR</span>
                            <span class="histo-dropdown__sub"></span>
                        </span>
                        <i class="fa-solid fa-chevron-right histo-dropdown__arrow-right"></i>
                    </button>

                    <!-- <div class="histo-dropdown__divider"></div> -->
                    
                    <button 
                        class="histo-dropdown__item histo-dropdown__item--annuler_obr"
                        v-if="selectedDropdownVente?.synced === true && selectedDropdownVente?.is_cancelled !== true"
                        @click="ouvrirAnnulDialog(selectedDropdownVente); activeDropdown = null"
                    >
                        <span class="histo-dropdown__text">
                            <span class="histo-dropdown__title annul-obr">Annuler l'envoi</span>
                            <span class="histo-dropdown__sub"></span>
                        </span>
                        <i class="fa-solid fa-chevron-right histo-dropdown__arrow-right"></i>
                    </button>
                    
                </div>
            </div>
            <div class="histo-overlay" @click="activeDropdown = null"></div>
        </template>
    </Teleport>

    <!-- DIALOG ANNULATION -->
<!-- DIALOG ANNULATION -->
<Teleport to="body">
    <div v-if="showAnnulDialog" class="dialog-overlay" @click.self="showAnnulDialog = false">
        <div class="annul-dialog">

            <!-- Icône d'avertissement -->
            <div class="annul-dialog__icon-wrapper">
                <div class="annul-dialog__icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>

            <!-- Header -->
            <div class="annul-dialog__header">
                <h2 class="annul-dialog__title">Annuler l'envoie à l'OBR</h2>
                <p class="annul-dialog__subtitle">
                    Vente <strong>N° {{ venteAnnuler?.id }}</strong> — 
                    {{ venteAnnuler?.client?.customer_name }}
                </p>
            </div>

            <!-- Avertissement -->
            <div class="annul-dialog__warning">
                <i class="fa-solid fa-circle-info"></i>
                <span>Cette action est irréversible. La vente sera marquée comme annulée à l'OBR.</span>
            </div>

            <!-- Champ motif -->
            <div class="annul-dialog__field">
                <label class="annul-dialog__label">
                    Motif de l'annulation <span style="color:#dc2626">*</span>
                </label>
                <textarea
                    v-model="motifAnnulation"
                    class="annul-dialog__textarea"
                    placeholder="Décrivez la raison de l'annulation..."
                    rows="3"
                ></textarea>
                <p v-if="annulError" class="annul-dialog__error">
                    <i class="fa-solid fa-circle-exclamation"></i> {{ annulError }}
                </p>
            </div>

            <!-- Boutons -->
            <div class="annul-dialog__actions">
                <button class="annul-dialog__btn annul-dialog__btn--cancel" @click="showAnnulDialog = false">
                    <i class="fa-solid fa-xmark"></i> Annuler
                </button>
                <button 
                    class="annul-dialog__btn annul-dialog__btn--confirm"
                    :disabled="annulLoading"
                    @click="confirmerAnnulation"
                >
                    <span v-if="annulLoading">
                        <i class="fa-solid fa-spinner fa-spin"></i> Traitement...
                    </span>
                    <span v-else>
                        <i class="fa-solid fa-ban"></i> Confirmer l'annulation
                    </span>
                </button>
            </div>

        </div>
    </div>
</Teleport>
</template>

<script>
import Filter_form from '@/components/filter_form.vue'
import Dialog_facture from '@/components/dialog_facture.vue'
import axios from 'axios';

export default {
    components: { Filter_form, Dialog_facture },

    data() {
        return {
            loading: false,
            error: false,
            show_table: false,
            selectedVente: null,
            selectedDropdownVente: null,
            search_query: "",
            activeDropdown: null,
            dropdownStyle: {},
            showAnnulDialog: false,
            venteAnnuler: null,
            motifAnnulation: "",
            annulError: "",
            annulLoading: false,
        }
    },

    computed: {
        resultsVentes() {
            const ventes = this.$store.getters.historique?.results || [];
            if (!this.search_query) return ventes;
            const q = this.search_query.toLowerCase();
            return ventes.filter(v =>
                v?.client?.customer_name?.toLowerCase().includes(q) ||
                v?.date?.toString().includes(q) ||
                v?.payee?.toString().includes(q) ||
                v?.prix_total?.toString().includes(q)
            );
        }
    },

    methods: {
        openDialog() {
            this.capital_show = true;
        },

        getData() {
            this.loading = true;
            let url = 'ventes/';
            let allResults = [];
            const pageLoad = (link) => {
                axios
                    .get(link, this.headers)
                    .then(res => {
                        allResults = allResults.concat(res.data.results);
                        if (res.data.next) {
                            pageLoad(res.data.next);
                        } else {
                            this.$store.state.ventes = { results: allResults };
                        }
                    })
                    .catch(err => console.log("ERREUR :", err))
                    .finally(() => { this.loading = false; });
            };
            pageLoad(url);
        },

        openFactures(vente) {
            this.selectedVente = vente;
            this.show_table = true;
            this.activeDropdown = null;
        },

        openPayment(vente) {
            this.activeDropdown = null;
            this.$router.push({
                name: 'Paiements',
                params: { id: vente.id },
                query: { total: vente.prix_total, paye: vente.payee }
            });
        },
        envoyerObr(vente) {
            axios
                .get(`ventes/${vente.id}/envoyer-obr/`, this.headers)
                .then(() => {
                    const results = this.$store.getters.historique?.results || [];
                    const index = results.findIndex(v => v.id === vente.id);
                    if (index !== -1) {
                        results[index].synced = true;
                    }
                    this.$toast.success("La vente a été envoyée dans l'OBR avec succès !", {
                        position: 'top-right',
                        duration: 4000
                    });
                })
                .catch((err) => {
                    console.log(err)
                    this.$toast.error(this.$getErrorMessage(err))
                });
        },

        updateFiltres(value) {
            this.search_query = value;
        },

        formatNumber(n) {
            if (!n && n !== 0) return "—";
            return new Intl.NumberFormat().format(n);
        },

        formatDate(d) {
            if (!d) return "—";
            return new Date(d).toLocaleDateString();
        },

        toggleDropdown(vente, event) {
            if (this.activeDropdown === vente.id) {
                this.activeDropdown = null;
                this.selectedDropdownVente = null;
                return;
            }

            const btn = event.currentTarget;
            const rect = btn.getBoundingClientRect();
            const menuWidth = 220;
            const menuHeight = 120;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceRight = window.innerWidth - rect.right;

            const top = spaceBelow < menuHeight
                ? rect.top - menuHeight - 2
                : rect.bottom + 2;

            const left = spaceRight < menuWidth
                ? rect.right - menuWidth
                : rect.left;

            this.dropdownStyle = {
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                zIndex: '99999'
            };

            this.selectedDropdownVente = vente;
            this.activeDropdown = vente.id;
        },
        ouvrirAnnulDialog(vente) {
            this.venteAnnuler = vente;
            this.motifAnnulation = "";
            this.annulError = "";
            this.showAnnulDialog = true;
        },
        confirmerAnnulation() {

            let payload = {
                cn_motif: this.motifAnnulation
            }

            this.annulLoading = true;
            axios
                .post(`ventes/${this.venteAnnuler.id}/annuler-obr/`, payload, this.headers
                )
                .then(() => {
                    const results = this.$store.getters.historique?.results || [];
                    const index = results.findIndex(v => v.id === this.venteAnnuler.id);
                    if (index !== -1) {
                        results[index].is_canceled = true;
                    }

                    this.$toast.success("L'envoi a été annulé avec succès !", {
                        position: 'top-right',
                        duration: 4000
                    });
                    this.showAnnulDialog = false;
                })
                .catch((err) => {
                    console.log(err)
                    this.$toast.error(this.$getErrorMessage(err));
                })
                .finally(() => {
                    this.annulLoading = false;
                });
        },
    },

    async mounted() {
        this.loading = true;
        try {
            await this.$store.dispatch('fetchAllHistorique');
        } catch (e) {
            console.error("Erreur chargement historique :", e);
            this.error = true;
        } finally {
            this.loading = false;
        }
    }
}
</script>

<style src="@/style.css"></style>

<style>
.envoi-obr {
    color: rgb(90, 167, 90);
}
.annul-obr {
    color: rgb(255, 160, 43);
}
.annul-dialog {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 440px;
    padding: 32px 28px 28px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    gap: 18px;
    animation: annul-pop .2s ease;
}

@keyframes annul-pop {
    from { opacity: 0; transform: scale(.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1)  translateY(0); }
}

/* Icône */
.annul-dialog__icon-wrapper {
    display: flex;
    justify-content: center;
}
.annul-dialog__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff7ed;
    border: 2px solid #fed7aa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #ea580c;
}

/* Header */
.annul-dialog__header {
    text-align: center;
}
.annul-dialog__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 4px;
}
.annul-dialog__subtitle {
    font-size: 0.82rem;
    color: #888;
    margin: 0;
}

/* Avertissement */
.annul-dialog__warning {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.8rem;
    color: #9a3412;
    line-height: 1.5;
}
.annul-dialog__warning i {
    margin-top: 2px;
    flex-shrink: 0;
    color: #ea580c;
}

/* Champ */
.annul-dialog__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.annul-dialog__label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
}
.annul-dialog__textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: border-color .2s;
    color: #1a1a2e;
    box-sizing: border-box;
}
.annul-dialog__textarea:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234,88,12,.08);
}
.annul-dialog__error {
    font-size: 0.78rem;
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0;
}

/* Boutons */
.annul-dialog__actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
}
.annul-dialog__btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all .15s;
}
.annul-dialog__btn--cancel {
    background: #f3f4f6;
    color: #374151;
}
.annul-dialog__btn--cancel:hover {
    background: #e5e7eb;
}
.annul-dialog__btn--confirm {
    background: #dc2626;
    color: #fff;
}
.annul-dialog__btn--confirm:hover:not(:disabled) {
    background: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220,38,38,.3);
}
.annul-dialog__btn--confirm:disabled {
    opacity: .6;
    cursor: not-allowed;
}
</style>