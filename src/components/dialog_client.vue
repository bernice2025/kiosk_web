<template>
    <div class="layout">
        <div class="card-body">
            <div class="legend">
                <div class="ajout">
                    <legend>Ajouter une clientèle</legend>
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
   data() {
       return {
           nom_client: "",
           number_phone: "",
           adresse: "",
           nif_client: "",
           client_assujetti_tva: "",
           loading: false
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

           try {
               const response = await apiClient.post('/clients/', form);

               this.$store.commit("SET_CLIENTS", response.data);

               console.log("Success :", response.data);

               this.$emit('close');

               localStorage.setItem("client", JSON.stringify(response.data));

                if(response) {
                    this.$toast.open({
                        type: 'success',
                        position: 'top',
                        message: 'Client ajouté avec succès !'
                    })
                }

           } catch (error) {
               console.error("Erreur API :", error?.response?.data || error);
           } finally {
               this.loading = false;
           }
       }
   }
};
</script>

<style src="@/dialog_style.css" scoped></style>
