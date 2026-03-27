<template>
    <div v-if="modelValue" class="dialog-overlay" @click.self="close">
        <div class="dialog-profile">
            <div class="header">
                <h2>Changer le mot de passe</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>
            <div class="password-container">
                <form @submit.prevent="submit">
                    <div class="form-row input-with-icon">
                        <label for="">Mot de passe actuel</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.current_password" required>
                        <button @click='togglePassword' type="button" class="toggle password-toggle">
                            <span v-if="showPassword"><i class="fas fa-eye"></i></span>
                            <span v-else><i class="fas fa-eye-slash"></i></span>
                        </button>
                    </div>
                    <div class="form-row input-with-icon">
                        <label>Nouveau mot de passe</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.new_password" required minlength="8" />
                        <button @click='togglePassword' type="button" class="toggle password-toggle">
                            <span v-if="showPassword"><i class="fas fa-eye"></i></span>
                            <span v-else><i class="fas fa-eye-slash"></i></span>
                        </button>
                    </div>
                    <div class="form-row input-with-icon">
                        <label>Confirmer le nouveau mot de passe</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.confirm_password" required />
                        <button @click='togglePassword' type="button" class="toggle password-toggle">
                            <span v-if="showPassword"><i class="fas fa-eye"></i></span>
                            <span v-else><i class="fas fa-eye-slash"></i></span>
                        </button>
                    </div>

                    <p v-if="error" class="error" style="color: blue;">{{ error }}</p>
                    <p v-if="success" class="success" style="color: red;">{{ success }}</p>

                    <div class="footer">
                        <button type="button" @click="close" class="btn-secondary">Annuler</button>
                        <button type="submit" class="btn-primary" :disabled="loading" @click="changePassword">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

    export default {
        name: 'DialogChangePassword',
        props: {
            modelValue: {
                type: Boolean 
            },
        },
        data() {
            return {
                form: {
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                },
                showPassword: true,
                loading: true,
                error: null,
                success: null,
                userId: null,
            }
        },
        emits: ['update:modelValue'],
        methods: {
            close() {
                this.$emit('update:modelValue', false)
            },
            togglePassword() {
                this.showPassword = !this.showPassword
            },
            fetchUserInfo() {
                this.loading = true

                axios
                    .get(`users/${this.$store.state.user.id}/`, this.headers)
                    .then((response) => {
                        this.$store.state.users = response.data || response.data.results
                    })
                    .catch((error) => {
                        console.log("AN ERROR OCCURED :", error)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            changePassword() {
                
                this.loading = true

                this.error = null
                this.success = null

                if (this.form.new_password !== this.form.confirm_password) {
                    this.error = "Les mots de passe ne correspondent pas."
                    return
                }

                if (this.form.new_password.length < 8) {
                    this.error = "Le mot de passe doit contenir au moins 8 caractères."
                    return
                }

                let payLoad = {
                    old_password: this.form.current_password,
                    new_password: this.form.new_password
                }

                axios
                    .post(`users/${this.$store.state.user.id}/set_password/`, payLoad, this.headers)
                    .then((response) => {
                        this.$store.state.users = response.data
                        this.$toast.success("Mot de passe changé avec succès")
                        this.$store.state.user = null
                        localStorage.clear()
                    })
                    .catch((error) => {
                        console.log("ERROR :", error);
                        this.error = "Erreur réseau ou serveur"
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
        },
        mounted() {
            this.fetchUserInfo()
        }
    }
</script>

<style scoped src="@/change_password_styles.css"></style>