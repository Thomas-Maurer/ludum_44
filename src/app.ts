/// <reference path="../node_modules/phaser3-docs/typescript/phaser.d.ts" />

import "phaser";
import MainScene from "./scripts/scenes/MainScene";

import ui from "./ui/main.js";
import "./styles/style.scss";
import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

new ui();
const gameConfig: GameConfig = {
  backgroundColor: "#000000",
  height: window.innerHeight,
  parent: "game",
  physics: {
    default: "matter",
    matter: {
      debug: false, // true for collisions debug
      gravity: { y: 2 } // This is the default value, so we could omit this
    },
  },
  scene: [MainScene],
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  },
  type: Phaser.AUTO,
  width: document.body.offsetWidth,
};
const game = new Phaser.Game(gameConfig);
new ui();
