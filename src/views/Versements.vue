<template>
    <div class="ensemble">
        <div class="form">
            <filter_form @open="capital_show = true"/>
        </div>
        <div class="tabilation">
            <div class="tableau">
                <table>
                    <thead>
                        <tr>
                            <th>Montant</th>
                            <th>Détails</th>
                            <th>Date de création</th>
                            <th>Créé par</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(v, index) in $store.state.versements.results" :key="v.id">
                            <td>{{ formatNumber(v.montant) }}</td>
                            <td>{{ v.details }}</td>
                            <td>{{ formatDate(v.created_at) }}</td>
                            <td>{{ v.created_by.username }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="capital" v-show="capital_show">
        <dialog_versements @close="capital_show = false"/>
    </div>
</template>

<script>
    import filter_form from '@/components/filter_form.vue';
    import dialog_versements from '@/components/dialog_versements.vue';
    export default {
        components: {
            filter_form,
            dialog_versements
        },
        data() {
            return {
                loading: false,
                capital_show: false
            }
        },
        methods: {
            getVersements() {

                this.loading = true;

                axios
                    .get('versements/', this.headers)
                    .then((response) => {
                        this.$store.commit('SET_VERSEMENTS', response.data)
                    })
                    .catch((error) => {
                        console.log("AN ERROR OCCURED :", error)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
        },
        mounted() {
            this.getVersements();
        }
    }
</script>

<style src="@/style.css"></style>