import { createStore } from "vuex";
import apiClient from "../axios";
import Versements from "@/views/Versements.vue";

const store = createStore({
    state: {
        user: {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzI1MTc1OSwiaWF0IjoxNzY3MDc4OTU5LCJqdGkiOiJlMzg5ZDQ0MDU2ZTA0MDg1ODUxMjRkNDYxMjAzYzljMCIsInVzZXJfaWQiOiIyIn0.tLqfhvsZQ3K5n9_awWU-rYgJZ_g2bmYLNV4RFKGwaOc",
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY3MTY1MzU5LCJpYXQiOjE3NjcwNzg5NTksImp0aSI6ImI0MGExYjUxODNkNzRlNDJhOTFkOWIzZTg3OGY2ZTM0IiwidXNlcl9pZCI6IjIifQ.CRGWrV2jKZzgF-wKXbPuNaEojpY2rgVuesPdwXB7Il0",
            "id": null,
            "username": "test",
            "email": "",
            "first_name": "Hogi",
            "last_name": "Tugende",
            "kiosk_id": null,
            "kiosk_name": "HOGI SPRL",
            avatar: null
        },

        pertes: { count: 0, next: null, previous: null, results: [] },
        depenses: { count: 0, next: null, previous: null, results: [] },
        stocks: { count: 0, next: null, previous: null, results: [] },
        injections: { count: 0, next: null, previous: null, results: [] },
        produits: { count: 0, next: null, previous: null, results: [] },
        kiosks: { count: 0, next: null, previous: null, results: [] },
        ventes: { count: 0, next: null, previous: null, results: [], totals: [] },
        clients: { count: 0, next: null, previous: null, results: [] },
        payments: { count: 0, next: null, previous: null, results: [] },
        historique: { count: 0, next: null, previous: null, results: [] },
        versements: { count: 0, next: null, previous: null, results: [] },
        produitSelectionne: null,
        favoris: [],
        panier: [],
        users: { count: 0, next: null, previous: null, results: [] },
        statistics_stock: null,
    },

    mutations: {
        SET_USER(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        UPDATE_PROFILE_PHOTO(state, avatar) {
            state.user.avatar = avatar
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        SET_PANIER(state, panier) {
            state.panier = panier;
            // localStorage.setItem('panier', JSON.stringify(state.panier))
        },
        CLEAR_PANIER(state) {
            state.panier = [];
        },

        SET_PERTES(state, pertes) {
            state.pertes = { ...pertes, results: pertes.results || [] };
            localStorage.setItem('pertes', JSON.stringify(state.pertes))
        },
        ADD_PERTES(state, perte) {
            state.pertes.results.unshift(perte);
        },

        SET_INJECTIONS(state, injections) {
            state.injections = injections;
            localStorage.setItem('injections', JSON.stringify(state.injections))
        },
        ADD_INJECTION(state, injection) {
            state.injections.results.unshift(injection);
        },

        SET_CLIENTS(state, clients) {
            state.clients = clients;
            localStorage.setItem('clients', JSON.stringify(state.clients))
        },
        ADD_CLIENT(state, client) {
            state.clients.results.unshift(client);
        },

        SET_PRODUITS(state, produits) {
            state.produits = {
                count: produits.count || 0,
                next: produits.next || null,
                previous: produits.previous || null,
                results: produits.results || [],
            };
            localStorage.setItem('produits', JSON.stringify(state.produits))
        },

        SET_DEPENSES(state, depenses) {
            state.depenses = depenses;
            localStorage.setItem('depenses', JSON.stringify(state.depenses))
        },

        SET_PAYMENTS(state, payments) {
            state.payments = payments;
            localStorage.setItem('payments', JSON.stringify(state.payments))
        },

        SET_STOCKS_PRODUITS(state, stocks) {
            state.stocks = stocks;
            localStorage.setItem('stocks', JSON.stringify(state.stocks))
        },

        SET_VENTES(state, ventes) {
            state.ventes = ventes;
            localStorage.setItem('ventes', JSON.stringify(state.ventes))
        },
        ADD_VENTE(state, vente) {
            state.ventes.results.unshift(vente);
        },

        toggleFavori(state, produit) {
            const index = state.favoris.findIndex((p) => p.id === produit.id);
            if (index === -1) state.favoris.push(produit);
            else state.favoris.splice(index, 1);
        },

        SET_PRODUIT_SELECTIONNE(state, produit) {
            state.produitSelectionne = produit;
        },
        SET_HISTORIQUE(state, historique) {
            state.historique = historique;
            localStorage.setItem('historique', JSON.stringify(state.historique))
        },
        SET_VERSEMENTS(state, versements) {
            state.versements = versements;
            localStorage.setItem('versements', JSON.stringify(state.versements))
        }
    },

    actions: {
        setProduitSelectionne({ commit }, produit) {
            commit("SET_PRODUIT_SELECTIONNE", produit);
        },
        setProduitSelectionneById({ commit, state, dispatch }, id) {
            const produit = state.produits.results.find((p) => p.id === id) || null;
            commit("SET_PRODUIT_SELECTIONNE", produit);
            if (produit) {
                return dispatch("fetchStocksProduit", id);
            }
            return Promise.resolve();
        },

        async ajouterPertesApi({ dispatch }, payload) {
            try {
                await apiClient.post("/pertes/", payload);
                await dispatch("fetchPertes");
            } catch (error) {
                console.error("❌ Erreur ajout pertes :", error);
            }
        },

        async fetchPertes({ commit }) {
            try {
                const response = await apiClient.get("/pertes/");
                commit("SET_PERTES", response.data);
            } catch (error) {
                console.error("❌ Erreur récupération pertes :", error);
            }
        },

        async fetchClients({ commit }, url = "/clients/") {
            try {
                const response = await apiClient.get(url);
                commit("SET_CLIENTS", response.data);
            } catch (error) {
                console.error("❌ Erreur récupération clients :", error);
            }
        },

        async fetchStocksApi({ commit }) {
            try {
                const response = await apiClient.get("/stocks/");
                commit("SET_STOCKS_PRODUITS", response.data);
            } catch (error) {
                console.error("❌ Erreur récupération stocks :", error);
            }
        },

        async fetchStocksProduit({ commit }, produitId) {
            try {
                const response = await apiClient.get(`/stocks/?produit=${produitId}`);
                commit("SET_STOCKS_PRODUITS", response.data);
            } catch (error) {
                console.error("❌ Erreur récupération stocks :", error);
            }
        },

        async ajouterStockApi({ dispatch }, payload) {
            try {
                await apiClient.post("/stocks/", payload);
                await dispatch("fetchStocksApi");
            } catch (error) {
                console.error("❌ Erreur ajout stock :", error);
                throw error;
            }
        },

        async fetchDepenses({ commit }) {
            try {
                const response = await apiClient.get("/depenses/");
                commit("SET_DEPENSES", response.data);
            } catch (error) {
                console.error("❌ Erreur dépenses :", error);
            }
        },

        async fetchPayments({ commit }) {
            try {
                const response = await apiClient.get("/payments/");
                commit("SET_PAYMENTS", response.data);
            } catch (error) {
                console.error("❌ Erreur payments :", error);
            }
        },

        async fetchVentes({ commit }) {
            try {
                const response = await apiClient.get("/ventes/");
                commit("SET_VENTES", response.data);
            } catch (error) {
                console.error("❌ Erreur récupération ventes :", error);
            }
        },

        async createVente({ commit }, payload) {
            try {
                const response = await apiClient.post("/ventes/", payload);

                commit("ADD_VENTE", response.data);
                commit("CLEAR_PANIER");

                return response.data;
            } catch (error) {
                console.error("❌ Erreur lors de la vente :", error);
                throw error;
            }
        },

        async fetchAllClients({ commit }) {
            try {
                let url = "/clients/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url);
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_CLIENTS", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération clients :", error);
                throw error;
            }
        },

        async createPrixProduit({ commit, dispatch, state }, { produitId, nouveauPrix }) {
            try {
                const response = await apiClient.post("/prix/", {
                    produit: produitId,
                    prix: nouveauPrix
                })
                const nouveauPrixCree = response.data;
                if (state.produitSelectionne && state.produitSelectionne.id === produitId) {
                    commit("SET_PRODUIT_SELECTIONNE", {
                        ...state.produitSelectionne,
                        prix: nouveauPrixCree
                    })
                }
                await dispatch("fetchAllProduits")
                return nouveauPrixCree;
            } catch (error) {
                console.error("❌ Erreur création prix produit :", error);
                throw error;
            }
        },

        async fetchAllProduits({ commit }) {
            try {
                let url = "/produits/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url);
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_PRODUITS", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération produits :", error);
                throw error;
            }
        },

        async fetchAllInjections({ commit }) {
            try {
                let url = "/injections/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url);
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_INJECTIONS", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération injections :", error);
                throw error;
            }
        },

        async fetchAllPertes({ commit }) {
            try {
                let url = "/pertes/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url);
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_PERTES", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération pertes :", error);
                throw error;
            }
        },

        async fetchAllDepenses({ commit }) {
            try {
                let url = "/depenses/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url);
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_DEPENSES", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération dépenses :", error);
                throw error;
            }
        },

        async fetchAllHistorique({ commit }, filters = {}) {
            try {
                let url = "/ventes/";
                let allResults = [];
                let response;

                while (url) {
                    response = await apiClient.get(url, { params: filters });
                    allResults = [...allResults, ...response.data.results];
                    url = response.data.next;
                }
                commit("SET_HISTORIQUE", {
                    count: allResults.length,
                    next: null,
                    previous: null,
                    results: allResults,
                });
            } catch (error) {
                console.error("❌ Erreur récupération historique :", error);
                throw error;
            }
        },
    },

    getters: {
        pertes: (state) => state.pertes || { results: [] },
        clients: (state) => state.clients || { results: [] },
        injections: (state) => state.injections || { results: [] },
        depenses: (state) => state.depenses || { results: [] },
        produits: (state) => state.produits || { results: [] },
        payments: (state) => state.payments || { results: [] },
        stocks: (state) => state.stocks || { results: [] },
        historique: (state) => state.historique || { results: [] },

        produitSelectionne: (state) => state.produitSelectionne,

        stocksProduit: (state) =>
            state.stocks && Array.isArray(state.stocks.results) ? state.stocks.results : [],
        versements: (state) => state.versements || { results: [] },
    },
});

export default store;