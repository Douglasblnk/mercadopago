<template>
  <div id="app">
    <mercadoPago />
  </div>
</template>

<script>
import mercadoPago from './view/mercadoPago.vue'

export default {
  name: 'App',
  components: {
    mercadoPago
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  background-color: #eee;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

h1, h2, h3, p, span {
  font-family: 'roboto';
  color: rgb(104, 104, 104)
}

hr {
  height: 1px;
  background-color: rgb(212, 212, 212);
  border: none;
}

</style>