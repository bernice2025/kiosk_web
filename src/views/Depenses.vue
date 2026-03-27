<template>
  <div class="ensemble">
    <div class="filter">
      <Filter_form @open="capital_shown = true" />
    </div>
    <div class="tabilation">
      <div class="tableau">
        <table>
          <thead>
            <tr>
              <th>Montant</th>
              <th>Date</th>
              <th>Type de dépense</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(depense, index) in resultsFiltres" :key="index">
              <td>{{ formatNumber(depense.montant) }} <small>Fbu</small></td>
              <td>{{ formatDate(depense.date) }}</td>
              <td>{{ depense.type_depense?.name || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="capital" v-show="capital_shown">
    <Dialog_depenses @close="capital_shown = false" />
  </div>
</template>

<script>
import Dialog_depenses from '@/components/dialog_depenses.vue';
import Filter_form from '@/components/filter_form.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Filter_form,
    Dialog_depenses,
  },

  data() {
    return {
      capital_shown: false,
      Pertes:[],
      loading: true,
      search_query: "",
    };
  },

  computed: {
    ...mapGetters(['depenses']), 
    resultsFiltres() {
      const depenses = this.$store.state.depenses?.results

      if (!this.search_query && !this.fieldSearch) {
        return depenses || []
      }

      const text = this.search_query

      return depenses.filter((d) => d.montant.toString().includes(text) || 
        d.type_depense.name.toLowerCase().includes(text.toLowerCase()) ||
        d.date?.toString().includes(text)
      )
    }
  },

  methods: {
    ...mapActions(['fetchAllDepenses']),
    updateFilters(payLoad) {
      this.search_query = payLoad
    }
  },

  async mounted() {
    try {
      await this.fetchAllDepenses()
    }catch (e) {
      this.error = "Impossible de charger les dépenses"
    }finally {
      this.loading = false
    }
  },
};
</script>

<style src="@/style.css"></style>