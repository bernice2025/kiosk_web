<template>
    <div class="layout" @click.self="$emit('close')">
        <div class="card-body">
            <div class="legend">
                <div class="ajout">
                    <legend>Ajouter un paiement</legend>
                </div>
                <div class="close">
                    <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
                </div>
            </div>

            <div class="input">
                <div class="montant">
                    <label for="montant">Montant</label>
                    <input type="number" id="montant" class="input" placeholder="Montant" v-model="montant">
                </div>

                <div>
                    <label for="date">Date du paiement</label>
                    <input type="date" v-model="date" class="input">
                </div>

                <div class="currency">
                    <label for="currency">Currency</label>
                    <select id="currency" v-model="currency">
                        <option value="BIF">BIF</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div class="details">
                    <label for="details">Détails</label>
                    <input type="text" id="details" class="input" placeholder="Détails" v-model="details">
                </div>

                <div class="type">
                    <label for="type">Type de paiement</label>
                    <select v-model="type_paiement">
                        <option value="1">En espèce</option>
                        <option value="2">A crédit</option>
                        <option value="3">Banque</option>
                        <option value="4">Autre</option>
                    </select>
                </div>

                <div class="type" v-if="type_paiement === '4'">
                    <label>Autres types de paiement</label>
                    <input type="text" class="input" placeholder="Type de paiement" v-model="autres_types">
                </div>
            </div>

            <div class="bt">
                <button type="submit" class="bouton dialog-btn" @click="postInfo">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        saleId: { type: String, required: true },
        dateIndex: { type: String }
    },

    data() {
        return {
            montant: "",
            date: "",
            currency: "BIF",
            details: "",
            type_paiement: "",
            autres_types: "",
            loading: false
        };
    },

    methods: {
        async postInfo() {
            // if (!this.montant || Number(this.montant) <= 0) {
            //     alert("Veuillez entrer un montant valide");
            //     return;
            // }

            // if (!this.type_paiement) {
            //     alert("Veuillez choisir un type de paiement");
            //     return;
            // }

            const form = {
                montant: Number(this.montant),
                currency: this.currency,
                ...(this.date ? { date: this.date } : {}),
                details: this.details,
                type_paiement: this.type_paiement,
                autres_type_paiement: this.autres_types || null,
                vente: this.$route.params.id
            };

            this.loading = true;

            axios.post('payments/', form, this.headers)
                .then((response) => {
                    this.$store.state.payments = response.data
                    this.$emit("paymentSuccess");
                    this.$emit("close");
                    localStorage.setItem('pay', JSON.stringify(response.data));

                    if(response.data) {
                        this.$toast.open({
                            type: 'success',
                            position: 'top',
                            message: 'Un paiement ajouté avec succès !'
                        })
                    } else {
                        this.$toast.error("Erreur inconnue")
                    }
                })
                .catch((err) => {
                    console.error("Error:", err.response?.data);
                    this.$toast.error(this.$getErrorMessage(err))
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
}
</script>

<style src="@/dialog_style.css" scoped></style>
