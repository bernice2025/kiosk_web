<template>
    <div class="tableau-style">
        <div class="title-side">
            <h4>Meilleures ventes</h4>
            <select v-model="timestamp">
                <option value="default">Par défaut</option>
                <option value="semaine">1 Semaine</option>
                <option value="2semaine">2 Semaines</option>
            </select>
        </div>
        <div class="table-side">
            <table>
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Quantité</th>
                        <th>Produit</th>
                        <th>Prix total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, index) in topProducts.slice(0, 10)" :key="v.id">
                        <td>{{ index+1 }}</td>
                        <td>{{ v.quantite }}</td>
                        <td>{{ v.nom }}</td>
                        <td>{{ formatNumber(v.prixTotal) }} Fbu </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            loading: false,
            timestamp: 'default'
        }
    },
    watch: {
        timestamp(newValue) {
            if (newValue === 'default') {
                this.getVentes()
            }

            if (newValue === 'semaine') {
                const { gte, lte } = this.getLastWeek()
                this.getVentes(gte, lte)
            }

            if (newValue === '2semaine') {
                const { gte, lte } = this.getLast2Weeks()
                this.getVentes(gte, lte)
            }
        }
    },
    computed: {
        topProducts() {
            const ventes = this.$store.state.ventes.results
            let allproducts = []
            let productsOneByOne = []

            ventes.forEach(element => {
                allproducts = [...allproducts, ...element.produits]
            });

            allproducts.forEach(element => {
                if (!productsOneByOne.some((p) => p.nom === element.nom)) {

                    const occurence = allproducts.filter(
                        (p) => p.nom === element.nom
                    )

                    productsOneByOne.push({
                        ...element,
                        quantite: occurence.length,
                        prixTotal: occurence.reduce((acc, item) => acc + item.prix.prix, 0)
                    })
                }
            })

            productsOneByOne.sort((a, b) => b.quantite - a.quantite)

            return productsOneByOne
        }
    },
    methods: {
        getLastWeek() {
            const today = new Date()
            const gte = new Date(today)        
            gte.setDate(today.getDate() - 7)

            const lte = today                  

            return {
                gte: gte.toISOString().split("T")[0],
                lte: lte.toISOString().split("T")[0]
            }
        },

        getLast2Weeks() {
            const today = new Date();
            const gte = new Date(today) ;       
            gte.setDate(today.getDate() - 14);

            const lte = today;                 

            return {
                gte: gte.toISOString().split("T")[0],
                lte: lte.toISOString().split("T")[0]
            }
        },

        getVentes(gte = null, lte = null) {
            this.loading = true

            let url = 'ventes/'

            if (gte && lte) {
                url += `?created_at__gt=${gte}&created_at__lt=${lte}`
            }
            let allResults = [];

            const pageLoad = (link) => {
                axios
                    .get(link, this.headers)
                    .then(response => {
                        allResults = allResults.concat(response.data.results)

                        if(response.data.next) {
                            pageLoad(response.data.next)
                        } else {
                            this.$store.state.ventes = {results: allResults}
                        }
                    })
                    .catch(err => {
                        console.log("ERROR :", err)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            };
            pageLoad(url)
        },
    },
    mounted() {
        this.getVentes()
    }
}
</script>

<style scoped>
.tableau-style {
    border-bottom: 1px solid rgb(221, 221, 221);
}
.title-side {   
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.title-side h4 {
    color: rgb(73, 73, 146);
}
.title-side select {
    max-width: 150px;
    padding: 4px;
    font-size: small;
    border: 1px solid rgb(108, 120, 161);
}
.hebdo {
    padding: 4px 10px;
    border-radius: 5px;
    border: 1px solid rgb(73, 73, 146);
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgb(73, 73, 146);
}
table {
    margin-top: 30px;
}
.table-side {
    height: 300px;
}
.table-side table tbody {
    display: block;
    max-height: 250px;
    overflow-y: auto;
    scrollbar-width: thin;
}
.table-side table thead {
    display: block;
}
.table-side table tr {
    display: flex;
}
.table-side table th,
.table-side table td {
    flex: 1;
}
</style>