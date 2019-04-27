<template>
  <div class="main-menu">
    <div class="main-menu-block" v-show="!play">
      <div class="game-title">LOREM IPSUM</div>

      <div class="btn play-btn" @click="play = true">PLAY</div>

      <div class="btn other-btn">BUTTON</div>
    </div>
  </div>
</template>
<script src="./MainMenu.js">
</script>
<style src="./MainMenu.scss">
</style>

