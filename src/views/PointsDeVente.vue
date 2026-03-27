<template>
<div class="compt">
    <div class="form">
        <Filter_form @filters="updateFilters"/>
    </div>
    <div class="product-style">
        <div class="product">
            <Card_product_fav 
                v-for="(produit) in produitsFiltres" 
                :produit="produit" :key="produit.id"
            />
        </div>
    </div>
</div>
</template>

<script>
import Filter_form from '@/components/filter_form.vue';
import Card_product_fav from '@/components/POS/card_product_fav.vue';
import axios from 'axios';

export default{
    components: {
        Filter_form,
        Card_product_fav
    },
    data() {
        return {
            loading:true,
            quantite: null,
            search_query: "",
        }
    },
    methods:{
        getData() {
            this.loading = true
            let url = "produits/"
            let allResults = []

            const loadPage = (link) => {
                axios
                    .get(link, this.headers)
                    .then((resp) => {
                        allResults = allResults.concat(resp.data.results);

                        if (resp.data.next) {
                            loadPage(resp.data.next)
                        } else {
                            this.$store.state.produits = {results: allResults};
                        }
                    })
                    .catch(error => {
                        console.log("AN ERROR OCCURED :", error)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
            loadPage(url)
        },
        updateFilters(value) {
            this.search_query = value
        }
    },
    computed: {
        produitsFiltres() {
            let produits = this.$store.state.produits?.results || [];

            let filtered = produits.filter(prod => Number(prod.quantite) > 0)

            if (!this.search_query) {
                return filtered
            }

            const query = this.search_query.toLowerCase()

            return filtered.filter((p) => {
                return p.name.toLowerCase().includes(query) ||
                p.prix.prix.toString().includes(query) ||
                p.quantite.toString().includes(query)
            })
        }
    },
    mounted(){
        this.getData();
    }
}
</script>
<style src="@/style.css"></style>