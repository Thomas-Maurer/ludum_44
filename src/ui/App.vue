<template>
  <div id="ui">
    <MainMenu/>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu/MainMenu.vue";
export default {
  name: "App",
  components: {
    MainMenu
  }
};
</script>

<style src="../styles/ui.scss">
</style>
