<template>
  <div>
    <!-- enable here  -->
    <div class="main-menu" v-if="!play">
      <div class="game-title">LOREM IPSUM</div>

      <div class="loading-block">
        <div class="loading-label" v-bind:class="{'active': loading}">Loading ...</div>
        <div class="start-info" v-bind:class="{'active': !loading}">
          Press
          <img src="../../../assets/graphics/ui/enter.png" alt>
          to play
        </div>
      </div>

      <div class="controls-block">
        <div class="control-type">
          <img src="../../../assets/graphics/ui/arrow_keys.png" alt>
          <span class="control-label">Move</span>
        </div>
        <div class="control-type">
          <img src="../../../assets/graphics/ui/space.png" alt>
          <span class="control-label">Attack</span>
        </div>
        <div class="control-type">
          <img src="../../../assets/graphics/ui/e.png" alt>
          <span class="control-label">Interact</span>
        </div>
        <div class="control-type potion">
          <div class="potion-icon"></div>
          <span class="control-label">Keep it full</span>
        </div>
      </div>
    </div>
    <div class="death-screen" v-if="dead">
      <h1>YOU ARE DEAD</h1>
      <div class="btn replay-btn" @click="retry()">RETRY</div>
    </div>

    <div class="win-screen" v-if="win">
      <h1>YOU WON</h1>
      <div class="btn replay-btn" @click="retry()">REPLAY</div>
    </div>
  </div>
</template>
<script src="./MainMenu.js">
</script>
<style src="./MainMenu.scss">
</style>

