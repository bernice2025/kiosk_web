<template>
    <div class="container">
        <div class="premier">
            <div class="cubas">
                <div class="heberger">
                    <h4>{{ produit.item.name }}</h4>
                    <p>Prix: {{ produit.item.prix.prix }} <small>Fbu</small></p>
                </div>
                <div class="supprimer" @click="remove(index)">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
            </div>
            <div class="signe">
                <div class="plus" @click="decrementer(produit)">
                    <i class="fa-solid fa-minus"></i>
                </div>
                <div class="nombre">
                    <p>{{ produit.quantity }}</p>
                </div>
                <div class="plus" @click="incrementer(produit)">
                    <i class="fa-solid fa-plus"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        produit: {
            type: Object
        }
    },
    data() {
        return {}
    },
    methods: {
        remove(index) {
            const removed = this.$store.state.panier.splice(index, 1)
            if (removed) {
                this.$toast.warning("L'élement est déjà retiré")
            }
            return removed
        },
        incrementer(produit) {
            produit.quantity++
        },
        decrementer(produit) {
            if (produit.quantity > 1) {
                produit.quantity--
            } else {
                this.$toast?.warn("Vous ne pouvez pas allez en dessous de 1. Si vous voulez le supprimer, Veuillez utiliser l'icone poubelle!")
            }  
        }
    }
}
</script>

<style scoped>
.container {
    height: 100%;
}
.nombre {
    font-size: 1.2em;
    border-right: 1px solid rgba(0, 0, 0, 0.475);
    border-left: 1px solid rgba(0, 0, 0, 0.475);
    flex-grow: 1;
    text-align: center;
}
.premier{
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid rgba(0, 0, 0, 0.475);
    padding: 10px;
    box-shadow: 0 4px 10px rgb(0, 0, 0, 0.3);
    border-radius: 10px;
    height: 100%;
    max-height: 200px;
    flex-grow: 1;
}
.cubas{
    display: flex;
    justify-content: space-between;
}
.heberger h4{
    font-size: 1.2em;
    line-height: 1.25;
    color: rgb(73, 73, 146);
}
.heberger p {
    margin-top: auto;
}
small{
    font-size: 0.9em;
}
.supprimer i{
    color: red;
    font-size: 1.2em;
    cursor: pointer;
}
.signe{
    display: flex;
    justify-content: space-between;
    border: 1px solid rgba(0, 0, 0, 0.475);
    border-radius: 5px;
    width: 100%;
    margin-top: auto;
}
.signe>div{
    padding: 5px 0 3px 0;
}   
.plus{
    width: 33.33%;
    text-align: center;
    cursor: pointer;
    color: rgb(73, 73, 146);
}
.envie{
    display: flex;
    justify-content: space-between;
}
</style>