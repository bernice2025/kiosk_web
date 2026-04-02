<template>
    <div class="stats-container">
        <div class="statCard" v-for="(stat, index) in stats" :key="index" 
         :class="stat.active == true ? 'isActive' : 'isNotActive'">
            <div class="icon-with-title">
                <i :class="stat.icon"></i>
                <div class="title-style">{{ stat.title }}</div>
            </div>
            <div class="value">
                <h3>{{ formatNumber(stat.value) }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            stats: [
                {icon: 'fas fa-chart-line', title: 'Balance', value: null, active: true},
                //{icon: 'fas fa-chart-line', title: 'Intérêts', value: null, active: true},
                {icon: 'fas fa-coins', title: 'Invest', value: null, active: false},
                {icon: 'fas fa-shopping-cart', title: 'Ventes', value: null, active: false},
                {icon: 'fas fa-dollar-sign', title: 'TVA', value: null, active: false},
                {icon: 'fas fa-box', title: 'Produits', value: null, active: false}
            ],
            loading: false
        }
    },
    methods: {
        loadStats() {
            this.loading = true;
            
            Promise.all([
                axios.get('kiosks/', this.headers),
                axios.get('injections/', this.headers)
            ])
            .then(([kiosksResp, injectionsResp]) => {
                const kiosks = kiosksResp.data.results[0]?.balance;
                const injections = injectionsResp.data.totals.montant

                this.stats[0].value = kiosks
                //this.stats[0].value = kiosks - injections
            })
            .catch(err => {
                console.log("ERREUR :", err)
            })
            .finally(() => {
                this.loading = false
            })

            axios
                .get('injections/', this.headers)
                .then(resp => {
                    this.stats[1].value = resp.data.totals.montant
                })
                .catch(err => {
                    console.log("ERRREUR INVESTISSEMENTS :", err)
                })
                .finally(() => {
                    this.loading = false
                });

            axios
                .get('ventes/', this.headers)
                .then((res) => {
                    this.stats[2].value = res.data.totals.payee
                    this.stats[3].value = res.data.totals.tva
                })
                .catch((err) => {console.log("ERREUR VENTES :", err)})
                .finally(() => {this.loading = false});

            axios
                .get('produits/', this.headers)
                .then(res => {this.stats[4].value = res.data.count})
                .catch(err => {console.log("ERREUR PRODUITS :", err)})
                .finally(() => {this.loading = false});            
        }
    },
    created() {
        this.loadStats()
    },
}
</script>

<style scoped>
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    height: auto;
}
.statCard {
    background: white;
    flex: 1;
    padding: 10px 15px 10px 15px;
    border-radius: 12px;
    color: rgb(73, 73, 146);
    transition: 0.3s;
    border: 1px solid #f0f0f0;
}
.statCard:hover {
    background-color: var(--primary);
    color: #f0f0f0;
    border: 1px solid var(--primary);
}
.value {
    margin-top: 15px;
    text-align: center;
}
</style>