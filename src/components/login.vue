<template>
    <div class="container">
    <div class="login">
        <div class="leftSide">
            <div class="logo"><h3><img src="/logo.png" alt="">UMUHORA</h3></div>
            <div class="loginImg">
                <img src="/login_image.png" alt="">
                <div class="text">Gérer chaque détail de votre magasin</div>
            </div>
        </div>
        <div class="rightSide">
            <div class="titre">
                <h3 class="mobile"><img width="40px" src="/logo.png" alt="">UMUHORA</h3>
                <h3>Se connecter</h3>
            </div>
            <div class="form">
                <div class="field">
                    <label for="nom d'utilidsateur"><i class="fa-solid fa-user input-icon"></i> Nom d'utilisateur</label>
                    <input type="text" placeholder="Nom d'utilisateur" v-model="username">
                </div>
                <div class="field">
                    <label for="mot de passe"><i class="fa-solid fa-lock input-icon"></i> Mot de passe</label>
                    <div class="input-with-icon">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Mot de passe">
                        <button @click='togglePassword' type="button" class="toggle password-toggle">
                            <span v-if="showPassword"><i class="fas fa-eye"></i></span>
                            <span v-else><i class="fas fa-eye-slash"></i></span>
                        </button>
                    </div>
                </div>
                <button class="bouton" @click="connect">Connexion</button>
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            showPassword: false,
            password: "", 
            username: "",
            errorMessage:"",
            loading: false,
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword
        },
        connect() {
            var data = {
                username: this.username,
                password: this.password
            };
            this.loading = true
            axios
                .post('login/', data)
                .then((response) => {
                    this.$store.state.user = response.data
                    localStorage.setItem('user', JSON.stringify(response.data))
                })
                .catch((error) => {
                    console.log("AN ERROR OCCURED : ", error)

                    if (error.response && error.response.data){
                        this.errorMessage = error.response.data.detail || 'le nom ou mot de passe incorrect'
                    }
                    else {
                        this.errorMessage = 'erreur inconnue. veuillez reessayer'
                    }
                })
                .finally(() => {
                    this.loading = false
                })
            
            this.$router.push({name: 'Accueil'})   
                
        }
    }
}
</script>

<style scoped>
.container {
    width: 100%;
    overflow-x: hidden;
}
.login {
    display: flex;
    justify-content: center;
    align-items: stretch;
    min-height: 100vh;
    overflow-y: auto;
}
img {
    max-width: 100%;
    height: auto;
}
.leftSide {
    background-color: rgba(181, 181, 223, 0.164);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    min-height: 100vh;
    height: auto;
    padding: 40px 0 40px 0;
}
.rightSide {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    min-height: 100vh;
    padding: 40px 0;
}
.mobile {
    display: none;
}
.loginImg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
} 
.text {
    color: rgb(60, 60, 194);
    margin-top: 25px;
    font-size: 20px;
}
.form {
    max-width: 400px;
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.logo img {
    width: 30px;
    margin-inline: 10px 8px;
}
.logo h3 {
    margin-top: -30px;
    color: rgb(55, 55, 156);
    font-size: 1.5rem;
} 
.bouton {
    margin-top: 10px;
}
.error{
    color: red;
}
@media screen and (max-width: 815px) {
    .leftSide {
        display: none;
    }
    .rightSide {
        min-height: 100vh;
        margin-top: -50px;
    }
    .mobile{
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .titre .mobile {
        margin-bottom: 20px;
    }
    .password-toggle {
        width: 20px;
        right: 0;
    }
    .form {
        width: 70%;
        max-width: 360px;
    }
    .titre h3 {
        text-align: center;
    }
}
@media screen and (max-height: 700px) {
    .login {
        align-items: flex-start;
    }
    .rightSide {
        justify-content: center;
        padding-top: 30px;
    }
    .leftSide {
        justify-content: center;
        padding-top: 30px;
    }
    .form {
        margin-bottom: 40px;
    }
}
@media screen and (max-width: 1024px) {
    .loginImg img {
        max-width: 80%;
    }
}
@media screen and (max-width: 360px) {
    .form {
        gap: 8px;
    }
    input {
        font-size: 14px;
    }
    .bouton {
        font-size: 14px;
        padding: 10px;
    }
}
</style>