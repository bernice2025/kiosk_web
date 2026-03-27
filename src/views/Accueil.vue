<template>
    <div class="container">
        <div class="interet">
            <Interets_number/>
        </div>
        <div class="vente">
            <div class="meilleur">
                <Meilleures_ventes class="meilleur-style"/>
            </div>
            <div class="client-chart">
                <div class="chart">
                    <DoughnutChart class="chart-style"/>
                </div>
                <div class="client">
                    <Clients_number/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Clients_number from '@/components/clients_number.vue';
import Meilleures_ventes from '@/components/meilleures_ventes.vue';
import Interets_number from '@/components/interets_number.vue';
import DoughnutChart from '@/components/vente_chart.vue';

export default{
    components :{
        Interets_number,
        Meilleures_ventes,
        Clients_number,
        DoughnutChart,
    },
}
</script>

<style scoped>
.container{
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.vente{
    display: flex;
    gap: 20px;
}
.meilleur{
    flex-grow: 1;
}
.client{
    width: 200px;
}
.client-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.chart {
    width: 200px;
}
@media screen and (max-width: 915px) {
    .vente {
        flex-direction: column;
    }
    .client-chart {
        flex-direction: row;
    }
    .chart {
        width: 100%;
    }
    .client {
        width: 100%;
    }
}
@media screen and (max-width: 410px) {
    .chart {
        width: 100%;
    }
    .client {
        width: 100%;
    }
    .client-chart {
        flex-direction: column;
    }
    .meilleur-style {
        font-size: small;
    }
}
</style>