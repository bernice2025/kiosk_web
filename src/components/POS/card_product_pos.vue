<template>
    <div class="une">
        <div class="shilo">
            <div class="h">
                <h4>Hebergement <br> essentiel</h4>
            </div>
            <div class="para">
                <div class="p">
                    <p>prix: 120 000 <small>Fbu</small></p>
                </div>
                <div class="quanti">
                    <p>Qte: 200</p>
                </div>
            </div>
        </div>
        <div class="panier">
            <i class="fa-solid fa-cart-shopping"></i>
        </div>
    </div>
</template>

<script>
export default {
    data() {}
}
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.une{
    padding: 10px;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgba(0, 0, 0, 0.475);
    width: 300px;
    height: 95px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.shilo{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.para{
    display: flex;
    gap: 5px;
}
.h h4{
    color: var(--primary);
}
.p{
    font-size: 0.25;
    border-right: 1px solid black;
    height: 20px;
}
small{
    padding: 0 10px 0 0;
}
.panier{
    width: 70px;
    border-radius: 10px;
    background: rgb(73, 73, 146);
}
.panier i{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;
    cursor: progress;
    }
</style>