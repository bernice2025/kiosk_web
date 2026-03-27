<template>
    <div class="ensemble">
        <div class="first">
            <div class="herge">
                <h4>{{ produit.name }}</h4>
            </div>
            <div class="emmet">
                <div class="p">
                    <P>
                        {{ formatNumber(produit?.prix?.prix) }}
                        <small>Fbu</small>
                    </P>
                </div>
                <div class="quenti">
                    <p>{{ formatNumber(produit?.quantite) }}</p>
                </div>
            </div> 
            <button class="bouton" @click="addToCart(produit)">
                <i class="fa-solid fa-cart-shopping"></i> Ajouter au panier
            </button>            
        </div>
    </div>
</template>

<script>
export default {
    props: ['produit'],
    data() {
        return {}
    },
    methods: {
        addToCart(produit) {
            const existing = this.$store.state.panier.find(x => x.item.id === produit.id);

            if (existing) {
                this.$toast?.warning("L'élement est déjà dans le panier! Rendez-vous dans le panier si vous voulez augmenter la quantité")
            } else {
                this.$store.state.panier.push({
                    item: produit,
                    quantity: 1
                });
                this.$toast?.success("L'élement ajouté avec succès")    
            }
        }
    }
}
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.first{
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.475);
    width: 100%;
    box-shadow: 0 4px 10px rgb(0, 0, 0, 0.3);
    border-radius: 5px;
    padding: 10px;
    gap: 5px;
    flex-grow: 1;
    max-height: 164px;
    height: 100%;
}
.herge h4{
    font-size: 1.2em;
    color: rgb(73, 73, 146);
    font-family: sans-serif;
}
.emmet{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
}
small{
    margin: 0 10px 0 0;
    font-size: 1em;
}
.p{
    border-right: 1px solid black;
}
.bouton {
    font-size: .9em;
    padding: 3px;
}
</style>