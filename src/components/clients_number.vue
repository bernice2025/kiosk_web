<template>
    <div class="stats-container">
        <div class="statCard">
            <div class="icon-with-title">
                <i class="fas fa-user-friends"></i>
                <div>Clients</div>
            </div>
            <div class="value" v-if="$store.state.clients && $store.state.clients.results">
                <h3>{{ $store.state.clients.count }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        getClients() {
            this.loading = true
            axios
                .get('clients/', this.headers)
                .then((response) => {
                    this.$store.state.clients = response.data
                })
                .catch((error) => {
                    console.log("AN ERROR OCCURED :", error.response?.data)
                })
                .finally(() => {
                    this.loading = false
                });
        },
    },
    mounted() {
        this.getClients();
    },
}
</script>

<style scoped>
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
    border: 1px solid rgba(231, 231, 231, 0.712);
    border-radius: 4px;
    color: rgb(73, 73, 146);
    transition: 0.3s;
}
.value {
    margin-top: 10px;
    text-align: center;
}
</style>