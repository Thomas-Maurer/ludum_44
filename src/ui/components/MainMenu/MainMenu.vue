<template>
  <div class="main-menu" v-if="!play">
    <div class="main-menu-block">
      <div class="game-title">LOREM IPSUM</div>

      <div class="btn play-btn" @click="setPlay()">PLAY</div>

      <div class="btn other-btn">BUTTON</div>
    </div>
  </div>
</template>
<script src="./MainMenu.js">
</script>
<style src="./MainMenu.scss">
</style>

