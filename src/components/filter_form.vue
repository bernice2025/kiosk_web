<template>
    <div class="input" v-if="route.name !='Point_de_vente'">
        <div class="nouveau">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Cherchez ici..." v-model="query" @input="$emit('search', query)">
        </div>
        <div class="ancien">
            <input type="date" v-model="field_search" @input="$emit('search', field_search)">
        </div>
        <!-- <button class="bouton mon-bouton"><i class="fa-solid fa-filter"></i></button> -->
        <button  @click="$emit('open')" class="bouton" id="add" v-if="route.name !='Historiques'">
            <i class="fa-solid fa-plus"></i> 
            <div>Ajouter</div>
        </button>
    </div>
    <div v-else class="input">
        <div class="nouveau" id="unique">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Cherchez ici..." @input="$emit('filters', text)"
                v-model="text"
            >
        </div>
    </div>
</template>
<script>
import { useRoute } from 'vue-router';
export default{
    setup(){
        const route = useRoute();
        return {route};
    },
    data() {
        return {
            text: "",
            query: "",
            field_search: ""
        }
    },
}
</script>
<style scoped>
.input{
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 4px;
}
.nouveau{
    padding-left: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    border: 1px solid rgb(73, 73, 164);
    background: white;
    width: 100%;
}
.nouveau-style {
    width: 100%;
}
.nouveau input{
    border: none;
    background: white;
}
.ancien{
    display: flex;
    gap: 20px;
    width: 100%;
}
.ancien input{
    border: 1px solid rgb(73, 73, 164);
    background: white;
}
.input .bouton{
    inline-size: 10%;
    padding-inline: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#add{
    width: 200px;
}
#unique{
    width: 100%;
}
</style>