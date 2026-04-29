<template>
    <Transition name="modal-fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="closeDialog">
            <Transition name="modal-slide">
                <div class="modal-container">
                    <!-- Header -->
                    <div class="modal-header">
                        <div class="header-content">
                            <i class="fa-solid fa-user-plus"></i>
                            <h2>{{ isEdit ? 'Modifier le client' : 'Ajouter un nouveau client' }}</h2>
                        </div>
                        <button class="close-btn" @click="closeDialog" type="button">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="modal-body">
                        <form @submit.prevent="submitForm">
                            <!-- Nom du client -->
                            <div class="form-group">
                                <label for="nom_client" class="form-label">
                                    <i class="fa-solid fa-user"></i>
                                    Nom du client
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="nom_client" 
                                    v-model="form.nom_client"
                                    placeholder="Ex: Jean Dupont"
                                    class="form-input"
                                    required
                                >
                            </div>

                            <!-- Téléphone -->
                            <div class="form-group">
                                <label for="phone" class="form-label">
                                    <i class="fa-solid fa-phone"></i>
                                    Téléphone
                                    <span class="required">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    v-model="form.number_phone"
                                    placeholder="Ex: +257 71 234 567"
                                    class="form-input"
                                    required
                                >
                            </div>

                            <!-- Adresse -->
                            <div class="form-group">
                                <label for="adresse" class="form-label">
                                    <i class="fa-solid fa-map-marker-alt"></i>
                                    Adresse
                                </label>
                                <input 
                                    type="text" 
                                    id="adresse" 
                                    v-model="form.adresse"
                                    placeholder="Ex: Rue Principale, Bujumbura"
                                    class="form-input"
                                >
                            </div>

                            <!-- NIF -->
                            <div class="form-group">
                                <label for="nif" class="form-label">
                                    <i class="fa-solid fa-id-card"></i>
                                    NIF (Numéro d'Identification Fiscale)
                                </label>
                                <input 
                                    type="text" 
                                    id="nif" 
                                    v-model="form.nif_client"
                                    placeholder="Ex: 123456789"
                                    class="form-input"
                                >
                            </div>

                            <!-- TVA -->
                            <div class="form-group checkbox-group">
                                <label for="tva" class="form-label">
                                    <i class="fa-solid fa-receipt"></i>
                                    Assujettissement TVA
                                </label>
                                <div class="checkbox-container">
                                    <label class="checkbox-label">
                                        <input 
                                            type="radio" 
                                            v-model="form.client_assujetti_tva" 
                                            :value="'0'"
                                            id="tva_non"
                                        >
                                        <span class="checkbox-text">Non assujetti</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input 
                                            type="radio" 
                                            v-model="form.client_assujetti_tva" 
                                            :value="'1'"
                                            id="tva_oui"
                                        >
                                        <span class="checkbox-text">Assujetti</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Footer -->
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeDialog" type="button">
                            <i class="fa-solid fa-times"></i>
                            Annuler
                        </button>
                        <button 
                            class="btn-submit" 
                            @click="submitForm"
                            :disabled="loading"
                            type="button"
                        >
                            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
                            <i v-else class="fa-solid fa-check"></i>
                            {{ loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter' }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script>
import apiClient from "@/axios";

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        clientId: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            form: {
                nom_client: "",
                number_phone: "",
                adresse: "",
                nif_client: "",
                client_assujetti_tva: "0"
            },
            loading: false,
            isEdit: false
        }
    },
    watch: {
        clientId: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.isEdit = true;
                    this.form = {
                        nom_client: newVal.customer_name || "",
                        number_phone: newVal.tel || "",
                        adresse: newVal.customer_address || "",
                        nif_client: newVal.customer_TIN || "",
                        client_assujetti_tva: String(newVal.vat_customer_payer) || "0"
                    };
                } else {
                    this.isEdit = false;
                    this.resetForm();
                }
            }
        },
        isOpen(val) {
            if (!val) {
                this.resetForm();
            }
        }
    },
    methods: {
        resetForm() {
            this.form = {
                nom_client: "",
                number_phone: "",
                adresse: "",
                nif_client: "",
                client_assujetti_tva: "0"
            };
        },
        async submitForm() {
            if (!this.form.nom_client.trim() || !this.form.number_phone.trim()) {
                this.$toast.error("Veuillez remplir les champs obligatoires");
                return;
            }

            this.loading = true;

            const payload = {
                customer_name: this.form.nom_client,
                tel: this.form.number_phone,
                customer_address: this.form.adresse,
                customer_TIN: this.form.nif_client,
                vat_customer_payer: this.form.client_assujetti_tva,
            };

            try {
                if (this.isEdit) {
                    await apiClient.put(`clients/${this.clientId.id}/`, payload);
                    this.$toast.success('Client modifié avec succès');
                } else {
                    await apiClient.post('clients/', payload);
                    this.$toast.success('Client ajouté avec succès');
                }
                this.$emit('success');
                this.closeDialog();
            } catch (error) {
                console.error(error);
                this.$toast.error(this.$getErrorMessage(error));
            } finally {
                this.loading = false;
            }
        },
        closeDialog() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-slide-enter-from {
    transform: translateY(-50px);
    opacity: 0;
}

.modal-slide-leave-to {
    transform: translateY(-50px);
    opacity: 0;
}

/* Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
}

/* Container */
.modal-container {
    background: linear-gradient(135deg, #fff5f7 0%, #f0e6ff 100%);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
    width: 85%;
    max-width: 380px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(102, 126, 234, 0.1);
}

/* Header */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 13px;
    background: linear-gradient(135deg, #6b75ff 0%, #6c74c0 100%);
    border-radius: 20px 20px 0 0;
    border-bottom: none;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
}

.header-content i {
    font-size: 20px;
}

.header-content h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.close-btn {
    background: rgba(255, 255, 255, 0.25);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: rotate(90deg);
}

/* Body */
.modal-body {
    padding: 16px 18px;
    flex: 1;
    max-height: 200px;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 14px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #6b7aff;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 5px;
}

.form-label i {
    color: #6b7aff;
    font-size: 12px;
}

.required {
    color: #6b7aff;
    font-weight: bold;
}

.form-input {
    width: 100%;
    padding: 9px 11px;
    border: 2px solid #f0e6ff;
    border-radius: 8px;
    font-size: 13px;
    transition: all 0.3s ease;
    font-family: inherit;
    background-color: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
    outline: none;
    border-color: #6b7aff;
    box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.08);
    background-color: white;
}

.form-input::placeholder {
    color: #6b7aff;
}

/* Checkbox Group */
.checkbox-group {
    margin-bottom: 14px;
}

.checkbox-container {
    display: flex;
    gap: 8px;
    margin-top: 5px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 7px 9px;
    border-radius: 6px;
    border: 2px solid #f0e6ff;
    transition: all 0.3s ease;
    flex: 1;
    background-color: rgba(255, 255, 255, 0.6);
}

.checkbox-label input[type="radio"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #6b7aff;
}

.checkbox-label:hover {
    border-color: #6b7aff;
    background-color: rgba(255, 107, 157, 0.05);
}

.checkbox-label input[type="radio"]:checked + .checkbox-text {
    color: #6b7aff;
    font-weight: 600;
}

.checkbox-text {
    color: #6c6dc0;
    font-weight: 500;
    font-size: 12px;
}

/* Footer */
.modal-footer {
    display: flex;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid rgba(102, 126, 234, 0.1);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0 0 20px 20px;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.btn-cancel {
    background-color: #f0e6ff;
    color: #6c6dc0;
}

.btn-cancel:hover {
    background-color: #e0d6ff;
    transform: translateY(-1px);
}

.btn-submit {
    background: linear-gradient(135deg, #6b7aff 0%, #6c6dc0 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.2);
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 157, 0.3);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Scrollbar styling */
.modal-container::-webkit-scrollbar {
    width: 5px;
}

.modal-container::-webkit-scrollbar-track {
    background: #f0e6ff;
    border-radius: 3px;
}

.modal-container::-webkit-scrollbar-thumb {
    background: #6b7aff;
    border-radius: 3px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
    background: #6c6dc0;
}

@media (max-width: 600px) {
    .modal-container {
        width: 90%;
        max-width: 350px;
    }

    .modal-header {
        padding: 14px 16px;
    }

    .header-content h2 {
        font-size: 14px;
    }

    .modal-body {
        padding: 14px 16px;
    }

    .modal-footer {
        padding: 10px 16px;
        gap: 6px;
    }

    .checkbox-container {
        flex-direction: column;
        gap: 6px;
    }

    .checkbox-label {
        width: 100%;
    }
}
</style>
