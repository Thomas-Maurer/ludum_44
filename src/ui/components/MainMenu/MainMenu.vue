<template>
  <div>
    <!-- enable here  -->
    <div class="main-menu" v-if="!play">
      <div class="game-title">
        <img src="../../../assets/graphics/ui/logo.png" alt="Vampire Quest">
      </div>

      <div class="continue-block">
        <div class="loading-label" v-bind:class="{'active': loading}">Loading ...</div>
        <div class="start-info" v-bind:class="{'active': !loading}">
          Press
          <img src="../../../assets/graphics/ui/enter.png">
          <span v-if="!tutorial">to continue</span>
          <span v-if="tutorial">to begin your journey</span>
        </div>
      </div>

      <div class="tutorial-block" v-show="tutorial">
        <div
          class="lore-block"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quae ullam temporibus ex eaque corrupti earum eius labore maiores. Ipsam facere officiis animi dolores neque vero ipsa repellendus voluptate nulla!</div>
        <div class="controls-block">
          <div class="control-type">
            <img src="../../../assets/graphics/ui/arrow_keys.png">
            <span class="control-label">Move</span>
          </div>
          <div class="control-type">
            <img src="../../../assets/graphics/ui/space.png">
            <span class="control-label">Attack</span>
          </div>
          <div class="control-type">
            <img src="../../../assets/graphics/ui/e.png">
            <span class="control-label">Interact</span>
          </div>
          <div class="control-type potion">
            <div class="potion-icon"></div>
            <span class="control-label">Keep it full</span>
          </div>
        </div>
      </div>

      <div class="credits">
        <h1>A game by :</h1>
        <ul>
          <li>Elisa DILLMANN</li>
          <li>Cyriaque DELAUNAY</li>
          <li>Raphael DOMINGUES</li>
          <li>Thomas MAURER</li>
          <li>Laurine LIETARD</li>
          <br>
          <li>Music by Kevin MacLeod</li>
        </ul>
      </div>
    </div>
    <div class="death-screen" v-if="dead">
      <h1>YOU ARE DEAD</h1>
      <div class="replay-info">
        Press
        <img src="../../../assets/graphics/ui/enter.png" alt>
        to retry
      </div>
    </div>

    <div class="win-screen" v-if="win">
      <h1>YOU WON</h1>
      <div class="replay-info">
        Press
        <img src="../../../assets/graphics/ui/enter.png" alt>
        to replay
      </div>
    </div>
  </div>
</template>
<script src="./MainMenu.js">
</script>
<style src="./MainMenu.scss">
</style>

