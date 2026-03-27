<template>
    <div class="cart-layout">
        <div class="cart-items-style">
            <div class="cart-items">
                <div v-if="$store.state.panier.length === 0" class="empty-cart">
                    <p>Votre panier est vide</p>
                </div>
                <div class="cart-card" v-else v-for="(prod, index) in $store.state.panier"
                :key="index">
                    <div class="cart-info">
                        <div class="cart-name-price">
                            <h4>{{ prod.item.name }}</h4>
                            <p>Prix: {{ formatNumber((prod.item.prix?.prix) * (prod.quantity)) }} <small>Fbu</small></p>
                        </div>
                        
                    </div>
                    <div class="quantity-box">
                        <div class="sign">
                            <div class="plus" @click="decrementer(prod)">
                                <i class="fa-solid fa-minus"></i>
                            </div>
                            <div class="nombre">
                                <p>{{ formatNumber(prod.quantity) }}</p>
                            </div>
                            <div class="plus" @click="incrementer(prod)">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                        <div class="delete-icon" @click="remove(index)">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-summary">
            <Vente_form class="vente-form-style"/>
        </div>
    </div>
</template>
<script>
import Vente_form from '@/components/vente_form.vue';

export default {
    components: {
        Vente_form,
    },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        remove(index) {
            const removed = this.$store.state.panier.splice(index, 1)
            if (removed) {
                this.$toast.warning("L'élement est déjà retiré")
            }
            return removed
        },
        incrementer(prod) {
            if (prod.quantity < prod.item.quantite) {
                prod.quantity++;
            } else {
                this.$toast.warning(`Vous ne pouvez pas dépasser le stock disponible (${prod.item.quantite} articles)`)
            }
        },
        decrementer(prod) {
            if (prod.quantity > 1) {
                prod.quantity--
            } else {
                this.$toast.warning("Vous ne pouvez pas aller en dessous de 1. Si vous voulez le supprimer, Veuillez utiliser l'icone poubelle!")
            }          
        }
    },
}
</script>
<style src="@/style.css"></style>