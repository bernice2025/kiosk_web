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

  <div v-if="deleteDialog" class="dialog-overlay" @click.self="deleteDialog = false">
    <div class="dialog-box">
      <h3>Confirmation</h3>
      <p>Voulez-vous vraiment supprimer ce client ?</p>

      <div class="dialog-actions">
        <button class="cancel" @click="deleteDialog = false">Annuler</button>
        <button class="confirm" @click="confirmDelete">Supprimer</button>
      </div>
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
      deleteDialog: false,
      clientTodelete: null
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
      this.clientToDelete = client
      this.deleteDialog = true
    },
    confirmDelete() {
  axios
      .delete(`clients/${this.clientToDelete.id}/`, this.headers)
      .then((response) => {
        this.$store.state.clients = response.data
        this.$toast.success("Le client est supprimé avec succès")
        this.fetchAllClients()
      })
      .catch((error) => {
        console.log(error)
        this.$toast.error(this.$getErrorMessage(error))
      })
      .finally(() => {
        this.deleteDialog = false
        this.clientToDelete = null
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
  border-radius: 5px;
}

button:last-child {
  background-color: red;
  color: white;
  border: 1px solid red;
  border-radius: 5px;
}
.parent-btn {
  display: flex;
  gap: 5px;
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.cancel {
  background: gray;
  color: white;
}

.confirm {
  background: red;
  color: white;
}
</style>