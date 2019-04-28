<template>
  <!-- enable here  -->
  <div class="main-menu" v-if="!play">
    <div class="main-menu-block">
      <div class="game-title">LOREM IPSUM</div>

      <div class="btn play-btn" @click="setPlay()">PLAY</div>
    </div>

    <div class="keyboard-mode">
      <div
        class="wasd key-icon"
        title="Click to witch to WASD mode"
        @click="setKeyboardMode('wasd')"
        v-bind:class="{'active': keyboardMode == 'wasd'}"
      >
        <img src="../../../assets/graphics/ui/wasd.png" alt="wasd">
      </div>
      <div
        title="Click to switch to ZQSD mode"
        class="zqsd key-icon"
        @click="setKeyboardMode('zqsd')"
        v-bind:class="{'active': keyboardMode == 'zqsd'}"
      >
        <img src="../../../assets/graphics/ui/zqsd.png" alt="zqsd">
      </div>
    </div>
  </div>
</template>
<script src="./MainMenu.js">
</script>
<style src="./MainMenu.scss">
</style>

