<template>
    <div class="dialog-style">
        <div class="top-side">
            <h2>Enregistrer une vente</h2>
            <i class="fas fa-times"></i>
        </div>
        <div class="middle-side">
            <div class="field">
                <label for="montant">Id</label>
                <input type="text" class="input">
            </div>
            <div class="field">
                <label for="details">Date</label>
                <input type="date" class="input">
            </div>
            <div class="field">
                <label for="details">Client</label>
                <div class="input-with-icon">
                    <input type="text" placeholder="------" class="input">
                    <button @click="toggleClient" type="button" class="toggle toggle-list">
                        <span><i class="fa-solid fa-chevron-down"></i></span>
                    </button>
                </div>
            </div>
            <div class="field">
                <label for="details">Invoice type</label>
                <div class="input-with-icon">
                    <input type="text" placeholder="Type de document à envoyer à l'OBR" class="input">
                    <button @click="toggleClient" type="button" class="toggle toggle-list">
                        <span><i class="fa-solid fa-chevron-down"></i></span>
                    </button>
                </div>
            </div>
            <div class="field">
                <label for="details">Invoice ref</label>
                <input type="text" placeholder="Numéro de référence de la facture qui fait objet d’une facture d’avoir ou de remboursement caution." class="input">
            </div>
            <div class="field">
                <label for="details">Cn motif</label>
                <input type="text" placeholder="Motif d'avoir, de remboursement ou de reduction" class="input">
            </div>
            <div class="field">
                <label for="details">Produit</label>
                <div class="input-with-icon">
                    <input type="text" placeholder="Sélectionner un produit" class="input">
                    <button @click="toggleClient" type="button" class="toggle toggle-list">
                        <span><i class="fa-solid fa-chevron-down"></i></span>
                    </button>
                </div>
            </div>
            <div class="field">
                <label for="details">Quantité</label>
                <input type="text" placeholder="Quantité" class="input">
            </div>
        </div>
        <button class="bouton">Enregistrer</button>
    </div>
</template>

<script>
export default {
    data() {}
}
</script>

<style scoped>
.dialog-style {
    width: 100%;
    padding: 20px;
    background-color: white;
    border-radius: 15px;
    max-height: 500px;
    overflow-y: auto;
    height: auto;
}
.input {
    padding: 4px;
}
.bouton {
    margin-top: 17px;
    padding: 5px;
}
label {
    font-size: .8em;
}
.middle-side {
    overflow-y: scroll;
    height: 200px;
}
</style>