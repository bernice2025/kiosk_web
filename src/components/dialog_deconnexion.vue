<template>
    <div class="dialog">
        <div class="dialog-style">
            <div class="top-side">
                <h4>Voulez-vous vraiment vous deconnecter?</h4>
                <!-- <i class="fas fa-times" @click="$emit('closeLogoutDialog')"></i> -->
            </div>
            <div class="btn">
                <button class="bouton confirm" @click="$emit('isLogout')">Oui</button>
                <button class="bouton annuler" @click="$emit('isNotLogout')">Non</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DialogDeconnect',
    data() {
        return{}
    }
}
</script>

<style scoped>
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.459);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.dialog-style {
    padding: 15px;
    width: 100%;
    max-width: 350px;
    margin-block: 120px;
    margin-inline: 36%; 
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.top-side {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: -3px;
}
.top-side i {
    font-size: 1em;
    color: var(--primary);
}
.btn {
    display: flex;
    justify-content: center;
    gap: 10px;
}
h4 {
    color: var(--primary);
}
.top-side i {
    cursor: pointer;
}
.bouton.confirm {
    background-color: red;
    color: white;
    padding: 5px;
    font-size: .9em;
    width: 30%;
}
.bouton.annuler {
    background-color: var(--primary);
    color: #f0f0f0;
    padding: 5px;
    font-size: .9em;
    width: 30%;
}
@media screen and (max-width: 540px) {
    .top-side {
        font-size: smaller;
    }
    .bouton.annuler {
        font-size: smaller;
    }
    .bouton.confirm {
        font-size: smaller;
    }
}
</style>