<template>
    <div class="layout" @click.self="$emit('close')">
        <div class="card-body">
            <div class="legend">
                <div class="ajout">
                    <legend>{{ isEdit ? 'Modifier les infos du client' : 'Ajouter une clientèle' }}</legend>
                </div>
                <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
            </div>

            <div class="input">
                <div class="montant">
                    <label for="nom">Nom du client</label>
                    <input type="text" id="nom" placeholder="Placez votre nom" v-model="nom_client">
                </div>

                <div class="details">
                    <label for="numero">Téléphone</label>
                    <input type="text" id="numéro" placeholder="Placez votre numero" v-model="number_phone">
                </div>

                <div class="date">
                    <label for="addres">Adresse</label>
                    <input type="text" id="addresse" v-model="adresse" placeholder="Mettez votre address physique">
                </div>

                <div class="nif">
                    <label for="adresse">NIF</label>
                    <input type="text" placeholder="votre Nif" v-model="nif_client">
                </div>

                <div class="select">
                    <label for="tva">Client assujetti à la TVA</label>
                    <select id="tva" v-model="client_assujetti_tva">
                        <option value="0">Non assujetti</option>
                        <option value="1">Assujetti</option>
                    </select>
                </div>
            </div>

            <div class="bt">
                <button class="bouton" @click="postInfo">Enregistrer</button>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from "@/axios";  // important !

export default {
    props: {
        clientId: {
            type: Object,
            default: null
        }
    },
   data() {
       return {
           nom_client: "",
           number_phone: "",
           adresse: "",
           nif_client: "",
           client_assujetti_tva: "",
           loading: false,
           isEdit: false
       }
   },
    watch: {
        clientId: {
            immediate: true,
            handler(newVal) {
            if (newVal) {
                this.isEdit = true

                this.nom_client = newVal.customer_name
                this.number_phone = newVal.tel
                this.adresse = newVal.customer_address
                this.nif_client = newVal.customer_TIN
                this.client_assujetti_tva = newVal.vat_customer_payer
            } else {
                this.isEdit = false
            }
            }
        }
    },

   methods: {
       async postInfo() {

           const form = {
               customer_name: this.nom_client,
               tel: this.number_phone,
               customer_address: this.adresse,
               customer_TIN: this.nif_client,
               vat_customer_payer: this.client_assujetti_tva,
           };

           this.loading = true;

           const request = this.isEdit ? axios.put(`clients/${this.clientId.id}/`, form, this.headers) : axios.post('clients/', form, )
           
           request 
            .then(() => {
                const msg = this.isEdit ? 'Infos du client modifiées avec succès' : 'Client ajouté avec succès'
                this.$emit('success')
                this.$emit('close')
                if (this.$toast) {
                    this.$toast.success(msg)
                }
            })
            .catch((error) => {
                console.log(error) 
                this.$toast.error(this.$getErrorMessage(error))
            })
            .finally(() => {
                this.loading = false
            })
       }
   }
};
</script>

<style src="@/dialog_style.css" scoped></style>
