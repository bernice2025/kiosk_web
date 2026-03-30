<template>
  <div class="ensemble">
    <div class="filtre">
      <Filter_form @open="capital_show = true" @search="updateFilters"/>
    </div>
    <div class="tabilation">
      <div class="tableau">
        <table v-if="!loading && injections.results.length">
          <thead>
            <tr>
              <th>Montant</th>
              <th>Détails</th>
              <th>Date de création</th>
              <th>Créé par</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(injection, index) in resultsInjections" :key="index">
              <td>{{ formatNumber(injection?.montant) }} <small>Fbu</small></td>
              <td>{{ injection?.details || '-'}}</td>
              <td>{{ formatDate(injection?.created_at) || '-' }}</td>
              <td>{{ injection?.created_by?.username || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else-if="!loading && !injections.results.length">Aucun capital trouvé</p>
        <p v-else>Chargement...</p>
      </div>
    </div>
  </div>
  <div class="capital" v-show="capital_show">
    <Dialog_capital 
      @close="capital_show = false"
      @capital-added="addCappital"
    ></Dialog_capital>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Dialog_capital from '@/components/dialog_capital.vue'
import Filter_form from '@/components/filter_form.vue'

export default {
  components: { Filter_form, Dialog_capital },
  data() {
    return {
      capital_show: false,
      loading: true,
      search_query: "",
    }
  },
  computed: {
    ...mapGetters(['injections']),
    resultsInjections() {
      if (!this.search_query && !this.fieldSearch) {
        return this.$store.state.injections.results || []
      }
      return this.$store.state.injections.results.filter((item) => {
        return item.montant.toString().toLowerCase().includes(this.search_query) ||
        item.details?.toLowerCase().includes(this.search_query.toLowerCase()) ||
        item.created_at?.toString().includes(this.search_query)
      })
    }
  },
  methods: {
    ...mapActions(['fetchAllInjections']),

    addCappital(capital) {
      this.injections.results.unshift(capital)
      this.capital_show = false
    },

    updateFilters(payLoad) {
      this.search_query = payLoad
    },

  },

  async mounted() {
    try {
      await this.fetchAllInjections()
    }catch (e) {
      console.log(e)
      this.$toast.error(this.$getErrorMessage(e))
    }finally {
      this.loading = false
    }
  }
}
</script>

<style scoped src="@/style.css"></style>