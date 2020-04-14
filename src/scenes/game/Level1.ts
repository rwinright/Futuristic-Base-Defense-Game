import { Scene, Cameras } from 'phaser';

import levelTiles from "../assets/world/tiles/tiles.png";
import levelBackground from "../assets/world/tiles/background.png";

import levelJson from "../assets/tilemaps/large-test-level.json";
import { CST } from '../../CST';

//Import Player sprites
import Player from '../../sprites/Player';

export default class Level1 extends Scene {
  constructor() {
    super({ key: CST.SCENES.GAME.LEVEL1 })
  }
  private keys: any;
  public player1: Player;
  private collisionLayers: any = [];

  init(data: any) {
    console.log(data.play);
  }

  public create() {
    //Probably going to extract all this to the "helper function"
    const map = this.make.tilemap({ key: 'level1Map' });
    const bgTiles = map.addTilesetImage("cave background", 'caveBG');
    const tiles = map.addTilesetImage("cave tileset", 'cave');
    
    //Set the names of the layers in the json file.
    const layerNames = ["Platforms"];
    
    //Since backgrounds are usually dynamic, this layer is created separately. 
    map.createStaticLayer('Background', bgTiles, 0, 200);
    //This needs some hardcore refactoring
    layerNames.forEach((layerName: string) => {
      if(layerName === "Platforms"){ //Layernames that need collisions
        //Temporary variable for the collision layer;
        let colLayer = map.createStaticLayer(layerName, tiles, 0, 200).setCollisionByExclusion([-1]);
        //Put the layers requiring collision into the outer array so the player can access it.
        this.collisionLayers.push(colLayer);
      } else {
        map.createStaticLayer(layerName, tiles, 0, 200);
      }
    });

    this.player1 = new Player(this, 400, 400, 'player1');
    
    this.keys = this.input.keyboard.addKeys("W, S, A, D, P, E, Q, SPACE");
    //Perhaps store all players in array and add colliders through iteration?
    this.player1.create();

    //Set player collision with platforms.
    this.physics.add.collider(this.player1, this.collisionLayers);
    
    

    this.cameras.main.startFollow(this.player1, false, 0.1, 0.5, 0, 0); //Follow the player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //force camera bounds from config file
  }

  public update() {
    this.player1.update(this.keys);
  }
}
