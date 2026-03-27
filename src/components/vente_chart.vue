<template>
  <div class="stats-container">
    <div class="w-72 mx-auto statCard">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { DoughnutController, ArcElement, Tooltip, Legend, Chart } from "chart.js";
import axios from "axios";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default {
  name: "DoughnutChart",

  data() {
    return {
      chart: null,
      loading: false
    };
  },

  mounted() {
    this.loadData()
  },

  methods: {
    loadData() {
      this.loading = true
      axios
        .get('ventes/', this.headers)
        .then((response) => {
          const venteData = response.data.totals;

          const montantAPayer = Number(venteData?.prix_total);
          const dette = Number(venteData?.dette);

          this.createChart(dette, montantAPayer);
          if (typeof montantAPayer !== 'number' || typeof dette !== 'number') {
            console.error('Données invalides pour le graphique');
            return;
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des statistiques :", error);
        })
        .finally(() => {
          this.loading = false
          console.log("Requête statistique terminée");
        });
    },

    createChart(lesDettes, lesMontantsApayer) {
      if (this.chart) this.chart.destroy();

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Les dettes", "Les prix totaux à payer"],
          datasets: [
            {
              data: [lesDettes, lesMontantsApayer],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF4C6D", "#2898DD"]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
.stats-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    height: auto;
}
.statCard {
    padding-bottom: 20px;
    background: white;
    flex: 1;
    padding: 10px 15px 10px 15px;
    color: rgb(73, 73, 146);
    transition: 0.3s;
    border: 1px solid rgba(231, 231, 231, 0.712);
    border-radius: 4px;
}
</style>