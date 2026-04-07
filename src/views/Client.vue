<template>
  <div class="ensemble">
    <div class="filter">
      <Filter_form @click="openDialog" @search="updateFilters"/>
    </div>

    <div class="tabilation">
      <div class="tableau">
        <table>
          <thead>
            <tr>
              <th>Nom du client</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>NIF</th>
              <th>TVA</th>
              <th>Date de création</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="6">Chargement des données...</td>
            </tr>

            <tr v-else-if="error">
              <td colspan="6" style="color: red;">{{ error }}</td>
            </tr>

            <tr v-else v-for="(item, index) in safeClients" :key="index">
              <td>{{ item.customer_name || '-' }}</td>
              <td>{{ item.tel || '-' }}</td>
              <td>{{ item.customer_address || '-' }}</td>
              <td>{{ item.customer_TIN || '-' }}</td>
              <td>{{ item.vat_customer_payer == 1 ? "Assujetti" : "Non assujetti" }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <div class="parent-btn">
                  <button @click="editClient(item)">Modifier</button>
                  <button @click="deleteClient(item)">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="capital" v-show="capital_show">
      <Dialog_client @close="capital_show = false" @client-added="handleClientAdded" @success="fetchAllClients" :client-id="selectedItem"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Dialog_client from '@/components/dialog_client.vue'
import Filter_form from '@/components/filter_form.vue'
import axios from 'axios';

export default {
  components:{
    Filter_form,
    Dialog_client,
  },

  data() {
    return {
      capital_show: false,
      loading: true,
      error: null,
      search_query: "",
      selectedItem: null,
    }
  },

  computed: {
    ...mapGetters(['clients']),

    safeClients() {
      const clients = this.$store.state.clients.results || []

      let filtered = clients

      if (this.search_query) {
        const text = this.search_query.toLowerCase()
        filtered = filtered.filter((c) => 
          c.customer_name?.toLowerCase().includes(text) ||
          c.tel?.toString().includes(text) ||
          c.customer_address?.toLowerCase().includes(text) ||
          c.customer_TIN?.toLowerCase().includes(text) ||
          c.created_at?.toString().includes(text)
        )
      }
      return filtered
    },
  },

  methods: {
    ...mapActions(['fetchAllClients']),
    openDialog() {
      this.capital_show = true
      this.selectedItem = null
    },

    editClient(item) {
      this.selectedItem = item
      this.capital_show = true
      // Tu peux aussi passer les données au dialog pour édition
    },
    deleteClient(client) {
      axios
        .delete(`clients/${client.id}/`, this.headers)
        .then((response) => {
          this.$store.state.clients = response.data
          this.$toast.success("Le client est supprimé avec succès")
          this.fetchAllClients()
        })
        .catch((error) => {
          console.log(error)
          this.$toast.error(this.$getErrorMessage(error))
        })
    },

    async handleClientAdded() {
      this.loading = true
      try {
        await this.fetchAllClients()
        this.capital_show = false
      } catch (e) {
        this.error = 'Impossible de charger les clients.'
      } finally {
        this.loading = false
      }
    },
    updateFilters(payload) {
      this.search_query = payload;
    },
  },

  async mounted() {
    try {
      await this.fetchAllClients()
    } catch (e) {
      this.error = 'Impossible de charger les clients.'
    } finally {
      this.loading = false
    }
  },
}
</script>

<style src="@/style.css"></style>

<style scoped>
button {
  /* margin: 0 5px; */
  padding: 5px 10px;
  cursor: pointer;
  /* display: flex; */
}

button:first-child {
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
}

button:last-child {
  background-color: red;
  color: white;
  border: 1px solid red;

}
.parent-btn {
  display: flex;
  gap: 5px;
}
</style>