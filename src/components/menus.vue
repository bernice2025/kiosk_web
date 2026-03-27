<template>
    <div class="menus">
        <div class="logo">
            <img src="/logo.png" alt="">
            <h4>UMUHORA</h4>
        </div>

        <div class="routes">
            <router-link to="/" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div class="item-1"><i class="fa-solid fa-house"></i>Accueil</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>

            <router-link to="/point-de-vente" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-receipt"></i>Point de vente</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/capital" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div class="item-2"><i class="fa-solid fa-dollar-sign"></i>Capital</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/clienteles" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-users"></i> Clientèles</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/produits/all" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-bag-shopping"></i>Produits</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/pertes" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-arrow-down"></i>Pertes</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/depenses" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-file-invoice-dollar"></i>Dépenses</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/versements" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-file-invoice-dollar"></i>Versements</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
            <router-link to="/historiques" class="routerlink" @click="$emit('closeMenu')">
                <div class="item">
                    <div><i class="fa-solid fa-clock-rotate-left"></i>Historiques</div>
                    <div><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </router-link>
        </div>

        <div class="btn">
            <button @click="$emit('openLogoutDialog')">
                Deconnexion <i class="fa-solid fa-solid fa-sign-out-alt"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            links: [ ]
        }
    }
}
</script>

<style scoped>
h4 {
    color: #f0f0f0;
}
.routes {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.routes a {
    text-decoration: none;
    color: #f0f0f0;
}
.item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}
.logo{
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
}
.logo img{
    margin-top: -5px;
}
.menus {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100vh;
    padding: 15px;
    background-color: var(--primary);
}
.router-link-active, .routerlink:hover{
    background-color: rgba(124, 158, 197, 0.356);
    border-radius: 5px;
}
.btn button {
    background-color: rgb(224, 37, 37);
    padding: 10px;
    border-radius: 5px;
    border: none;
    color: #f0f0f0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    max-width: 160px;
    margin: auto;
}
.item > div:first-child{
    display: flex;
    align-items: center;
    grid-area: 10px;
}
.item > div:first-child i{
    width: 20px;
    text-align: center;
    flex-shrink: 0;
}

@media screen and (max-width: 991px) {
    .menus{
        position: relative;
    }
    .logo {
        display: flex;
        gap: 10px;
    }
    .logo h4{
        margin-top: 5px;
    }
    .btn {
        position: absolute;
        top: 85%;
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>