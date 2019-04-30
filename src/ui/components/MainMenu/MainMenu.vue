<template>
  <div>
    <!-- enable here  -->
    <div class="main-menu" v-if="!play">
      <div class="game-title" v-if="!tutorial">
        <img src="../../../assets/graphics/ui/logo.png" alt="Vampire Quest">
      </div>

      <div class="gameplay-elements-block" v-show="tutorial">
        <div class="gameplay-element">
          <div class="icon">
            <img src="../../../assets/graphics/ui/sun.png">
          </div>
          <span class="label">You are protected from the sun</span>
        </div>
        <div class="gameplay-element">
          <div class="icon">
            <img src="../../../assets/graphics/ui/sun_active.png">
          </div>
          <span class="label">You are taking damages from the sun</span>
        </div>
        <div class="gameplay-element">
          <div class="icon">
            <img src="../../../assets/graphics/ui/bloodpotion_single.png">
          </div>
          <span class="label">Represent your life</span>
        </div>
        <div class="gameplay-element">
          <div class="icon">
            <img src="../../../assets/graphics/ui/ennemie_gameplay.png">
          </div>
          <span class="label">Kill them and absorb their blood to regain your life</span>
        </div>
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
        <div class="lore-block">
          <p>
            You are Lord Barouny from the Khurleigh Castle in the
            Shrewsword Highlands. Your goal is to retrieve the Divine
            Chalice by stealing it from the Crusader of Light in the Church.
          </p>
        </div>
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

