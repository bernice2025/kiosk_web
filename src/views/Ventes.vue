<template>
    <div class="container-style">
        <div v-if="$store.state.panier.length === 0" class="empty-cart">
            <h4>Votre est vide</h4>
        </div>
        <div class="card-style" v-else>
            <Card_product v-for="produit in $store.state.panier" :produit="produit" :key="produit.id"/>
        </div>
        <div class="vente-form">
            <Vente_form class="vente-form-style"/>
        </div>
    </div>
</template>

<script>
import Card_product from '@/components/card_product.vue';
import Vente_form from '@/components/vente_form.vue';
export default {
    components: {
        Card_product,
        Vente_form
    },
}
</script>

<style scoped>
.card-style {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    height: calc(100vh - 54px);
    overflow-y: auto;
    padding: 10px;
}
.container-style {
    display: flex;
    padding: 20px;
    gap: 10px;
}
@media screen and (max-width: 1115px) {
    .vente-form {
        width: 60%;
    }
} 
</style>