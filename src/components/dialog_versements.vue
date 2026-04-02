<template>
    <div class="layout" @click.self="$emit('close')">
        <div class="card-body">
            <div class="legend">
                <div class="ajout">
                    <legend>Ajouter un versement</legend>
                </div>
                <div class="close">
                    <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
                </div>
            </div>
            <div class="input">
                <div class="montant">
                    <label for="montant">Montant</label>
                    <input type="number" id="" class="" placeholder="" v-model="montant">
                </div>
                <div class="details">
                    <label for="details">Détails</label>
                    <input type="string" id="" class="" placeholder="" v-model="details">
                </div>
            </div>
            <div class="bt">
                <button type="submit" class="bouton dialog-btn" @click="postInfo" v-if="loading">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                montant: null,
                details: "",
                loading: true
            }
        },
        methods: {
            postInfo() {
                let payload = {
                    montant: this.montant,
                    details: this.details
                }

                this.loading = true

                axios
                    .post('versements/', payload, this.headers)
                    .then((response) => {
                        this.$store.state.versements = response.data || response.data.results
                        this.$emit('close');
                        this.$toast.success("Un versement enregistré avec succès")
                    })
                    .catch((error) => {
                        console.log("AN ERROR OCCURED :", error)
                        this.$toast.error("Error !")
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
        }
    }
</script>

<style src="@/dialog_style.css" scoped></style>