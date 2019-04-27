<template>
  <div id="ui">
    <MainMenu/>
    <Gameplay/>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu/MainMenu.vue";
import Gameplay from "./components/Gameplay/Gameplay.vue";
export default {
  name: "App",
  components: {
    MainMenu,
    Gameplay
  }
};
</script>

<style src="../styles/ui.scss">
</style>
