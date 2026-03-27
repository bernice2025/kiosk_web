<template>
<div class="layout">
    <div class="card-body">
        <div class="legend">
            <div class="ajout">
            <legend>Ajouter une dépense</legend>
            </div>
            <i class="fa-solid fa-xmark" @click="$emit('close')"></i>
        </div>
        <div class="input">
            <div class="montant">
                <label for="montant">Montant</label>
                <input type="number" id="montant" placeholder="Montant" v-model="form.montant">
            </div>
            <div class="date">
                <label for="date">Date</label>
                <input type="date" v-model="form.date">
            </div>
            <div class="type">
                <label for="type">Type de depense</label>
                <select v-if="!isNewType" v-model="form.type_depense">
                    <option disabled value="">-- Sélectionne un type de dépense --</option>
                    <option v-for="d in depenses" :key="d.id" :value="d.id">{{ d.name }}</option>
                    <option value="__new">+ Ajouter un nouveau type...</option>
                </select>

                <div v-else>
                    <input type="text" placeholder="Nom du nouveau type" v-model="newTypeName">
                    <div style="margin-top:6px; display: flex; gap: 3px;">
                        <button class="bouton" @click="cancelNewType" type="button">Annuler</button>
                        <button class="bouton" @click="createTypeDepense" :disabled="!newTypeName" type="button">Créer</button>
                    </div>
                </div>

                <div style="margin-top:6px;">
                    <label style="cursor:pointer;"><input type="checkbox" v-model="isNewType"> Créer un nouveau type</label>
                </div>
            </div>
        </div>
        <div class="bt">
                <button class="bouton" @click="postInfo">Enregistrer</button>
            </div>
    </div>
</div>
</template>

<script>

export default {
    data() {
        return {
            depenses: [],
            loading: false,
            isNewType: false,
            newTypeName: '',
            form: {
                montant: null,
                details: null,
                date: "",
                type_depense: null
            }
        }
    },
    methods: {
        getTypeDepense() {
            this.loading = true;
            axios
                .get('depenses_types/', this.headers)
                .then((response) => {
                    this.depenses = response.data.results || response.data
                })
                .finally(() => {
                    this.loading = false
                })
        },
        postInfo() {
            const doPost = () => {
                let payLoad = {
                    montant: this.form.montant,
                    date: this.form.date || null,
                    type_depense: this.form.type_depense
                }
                this.loading = true
                return axios
                    .post('depenses/', payLoad, this.headers)
                    .then((resp) => {
                        this.$store.state.depenses.results.push(resp.data);
                        console.log('Success:', resp.data);
                        this.$emit('close');
                        localStorage.setItem('depense', JSON.stringify(resp.data))

                        if (resp.data) {
                            this.$toast.open({
                                type: 'success',
                                position: 'top',
                                message: 'Une dépense ajoutée avec succès !'
                            })
                        }
                        return resp;
                    })
                    .catch((err) => {
                        console.error('Error:', err);
                        throw err;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            };

            if ((this.isNewType || this.form.type_depense === '__new') && this.newTypeName) {
                this.createTypeDepense().then(() => doPost()).catch(() => {});
            } else {
                doPost();
            }
        },

        createTypeDepense() {
            if (!this.newTypeName) return Promise.reject(new Error('Nom requis'));
            this.loading = true;
            const payload = { name: this.newTypeName };
            return axios.post('depenses_types/', payload, this.headers)
                .then((res) => {
                    const created = res.data;
                    if (created && created.id) {
                        this.depenses.push(created);
                        this.form.type_depense = created.id;
                        this.newTypeName = '';
                        this.isNewType = false;
                    }
                    return created;
                })
                .catch((err) => {
                    console.error('Erreur création type dépense:', err);
                    this.$toast && this.$toast.open && this.$toast.open({ type: 'error', message: "Impossible de créer le type" });
                    throw err;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        cancelNewType() {
            this.newTypeName = '';
            this.isNewType = false;
        },
    },
    watch: {
        'form.type_depense'(val) {
            if (val === '__new') {
                this.isNewType = true;
                this.form.type_depense = null;
            }
        }
    },
    mounted() {
        this.getTypeDepense()
    }
}
</script>

<style src="@/dialog_style.css" scoped></style>