<template>
  <div class="gameplay" v-if="play">
    <div
      class="icon bloodpotion"
      v-bind:class="{
        'hp100': playerHP > 75,
        'hp75': playerHP > 50 && playerHP <= 75,
        'hp50': playerHP > 25 && playerHP <= 50,
        'hp25': playerHP > 0 && playerHP <= 25,
        'hp0': playerHP === 0,
      }"
    ></div>
    <span class="potion-label">{{playerHP}}</span>
    <div class="item potion" v-if="potion">
      <img src="../../../assets/graphics/ui/iconspeedpotion.png" alt>
    </div>
    <div class="item glass" v-if="glass">
      <img src="../../../assets/graphics/ui/iconglasses.png" alt>
    </div>
    <div class="item umbrella" v-if="umbrella">
      <img src="../../../assets/graphics/ui/iconumbrella.png" alt>
    </div>
  </div>
</template>
<script src="./Gameplay.js">
</script>
<style src="./Gameplay.scss">
</style>

