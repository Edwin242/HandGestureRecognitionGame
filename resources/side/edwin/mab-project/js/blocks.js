import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const texture = textureLoader.load(path)
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}
//'http://localhost/side/zach/tensorflowModels/my-model.json'
const textures = {
  dirt: loadTexture('http://localhost/side/zach/textures/moonDirt.jpg'),
  grass: loadTexture('http://localhost/side/zach/textures/grass.png'),
  grassSide: loadTexture('http://localhost/side/zach/textures/grass_side.png'),
  stone: loadTexture('http://localhost/side/zach/textures/steel.jpg'),
  coalOre: loadTexture('http://localhost/side/zach/textures/blackWall.jpg'),
  ironOre: loadTexture('http://localhost/side/zach/textures/path.jpg'),
  leaves: loadTexture('http://localhost/side/zach/textures/leaves.png'),
  treeSide: loadTexture('http://localhost/side/zach/textures/tree_side.png'),
  treeTop: loadTexture('http://localhost/side/zach/textures/tree_top.png'),
  sand: loadTexture('http://localhost/side/zach/textures/sand.png'),
  concrete: loadTexture('http://localhost/side/zach/textures/concrete.jpeg'),
  brick: loadTexture('http://localhost/side/zach/textures/brick.png'),
  glass: loadTexture('http://localhost/side/zach/textures/glass.jpeg'),
  wooden: loadTexture('http://localhost/side/zach/textures/woodenFloor.png'),
  roof: loadTexture('http://localhost/side/zach/textures/roof.jpg'),
  coin: loadTexture('http://localhost/side/zach/textures/coin.jpg'),
  road1: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-1.jpg'),
  road2: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-2.jpg'),
  road3: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-3.jpg'),
  road4: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-4.jpg'),
  road5: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-5.jpg'),
  road6: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-6.jpg'),
  road7: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-7.jpg'),
  road1y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-1y.jpg'),
  road2y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-2y.jpg'),
  road3y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-3y.jpg'),
  road4y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-4y.jpg'),
  road5y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-5y.jpg'),
  road6y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-6y.jpg'),
  road7y: loadTexture('http://localhost/side/zach/textures/roadTextures/row-1-column-7y.jpg'),
  darkGlass: loadTexture('http://localhost/side/zach/textures/darkGlass.png'),
  darkWood: loadTexture('http://localhost/side/zach/textures/darkWood.png'),
  lightGlass: loadTexture('http://localhost/side/zach/textures/lightGlass.png'),
  flowerWall: loadTexture('http://localhost/side/zach/textures/flowerWall.png'),
  greyAndWhite: loadTexture('http://localhost/side/zach/textures/greyAndWhite.png'),
  redAndBlack: loadTexture('http://localhost/side/zach/textures/redAndBlack.png'),
};

export const blocks = {
  empty: {
    id: 0
  },
  grass: {
    id: 1,
    name: 'grass',
    color: 0x559020,
    material: [
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // right
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // left
      new THREE.MeshLambertMaterial({ map: textures.grass }), // top
      new THREE.MeshLambertMaterial({ map: textures.dirt }), // bottom
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), // front
      new THREE.MeshLambertMaterial({ map: textures.grassSide })  // back
    ]
  },
  dirt: {
    id: 2,
    name: 'dirt',
    color: 0x807020,
    material: new THREE.MeshLambertMaterial({ map: textures.dirt })
  },
  stone: {
    id: 3,
    name: 'stone',
    color: 0x808080,
    scale: { x: 30, y: 30, z: 30 },
    scarcity: 0.5,
    material: new THREE.MeshLambertMaterial({ map: textures.stone })
  },
  coalOre: {
    id: 4,
    name: 'coalOre',
    color: 0x202020,
    scale: { x: 20, y: 20, z: 20 },
    scarcity: 0.8,
    material: new THREE.MeshLambertMaterial({ map: textures.coalOre })
  },
  ironOre: {
    id: 5,
    name: 'ironOre',
    color: 0x806060,
    scale: { x: 60, y: 60, z: 60 },
    scarcity: 0.9,
    material: new THREE.MeshLambertMaterial({ map: textures.ironOre })
  },
  tree: {
    id: 6,
    name: 'tree',
    visible: true,
    material: [
      new THREE.MeshLambertMaterial({ map: textures.treeSide }), // right
      new THREE.MeshLambertMaterial({ map: textures.treeSide }), // left
      new THREE.MeshLambertMaterial({ map: textures.treeTop }), // top
      new THREE.MeshLambertMaterial({ map: textures.treeTop }), // bottom
      new THREE.MeshLambertMaterial({ map: textures.treeSide }), // front
      new THREE.MeshLambertMaterial({ map: textures.treeSide })  // back
    ]
  },
  leaves: {
    id: 7,
    name: 'leaves',
    visible: true,
    material: new THREE.MeshLambertMaterial({ map: textures.leaves })
  },
  sand: {
    id: 8,
    name: 'sand',
    visible: true,
    material: new THREE.MeshLambertMaterial({ map: textures.sand })
  },
  cloud: {
    id: 9,
    name: 'cloud',
    visible: true,
    material: new THREE.MeshBasicMaterial({ 
    color: 0x33cc00,
    transparent: true,
    opacity: 0.4
  
  })

  },
  concrete: {
    id: 10,
    name: 'concrete',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.concrete })

  },
  brick: {
    id: 11,
    name: 'brick',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.brick })

  },
  glass: {
    id: 12,
    name: 'glass',
    visible: true,
    material: new THREE.MeshBasicMaterial({ 
      map: textures.glass,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    })
  },
  wooden: {
    id: 13,
    name: 'wooden',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.wooden })
  },
  roof: {
    id: 14,
    name: 'roof',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.roof })
  },
  coin: {
    id: 15,
    name: 'coin',
    visible: true,
    material: new THREE.MeshBasicMaterial({ 
      map: textures.coin,
      transparent: true,
      opacity: 0
    })
  },
  road1: {
    id: 16,
    name: 'road1',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road1 })
  },
  road2: {
    id: 17,
    name: 'road2',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road2 })
  },
  road3: {
    id: 18,
    name: 'road3',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road3 })
  },
  road4: {
    id: 19,
    name: 'road4',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road4 })
  },
  road5: {
    id: 20,
    name: 'road5',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road5 })
  },
  road6: {
    id: 21,
    name: 'road6',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road6 })
  },
  road7: {
    id: 22,
    name: 'road7',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road7 })
  },
  road1y: {
    id: 23,
    name: 'road1y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road1y })
  },
  road2y: {
    id: 24,
    name: 'road2y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road2y })
  },
  road3y: {
    id: 25,
    name: 'road3y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road3y })
  },
  road4y: {
    id: 26,
    name: 'road4y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road4y })
  },
  road5y: {
    id: 27,
    name: 'road5y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road5y })
  },
  road6y: {
    id: 28,
    name: 'road6y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road6y })
  },
  road7y: {
    id: 29,
    name: 'road7y',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.road7y })
  },
  darkGlass: {
    id: 30,
    name: 'darkGlass',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.darkGlass })
  },
  darkWood: {
    id: 31,
    name: 'darkWood',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.darkWood })
  },
  lightGlass: {
    id: 32,
    name: 'lightGlass',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.lightGlass })
  },
  flowerWall: {
    id: 33,
    name: 'flowerWall',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.flowerWall })
  },
  greyAndWhite: {
    id: 34,
    name: 'greyAndWhite',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.greyAndWhite })
  },
  redAndBlack: {
    id: 35,
    name: 'redAndBlack',
    visible: true,
    material: new THREE.MeshBasicMaterial({ map: textures.redAndBlack })
  },
}

export const resources = [
  blocks.stone,
  blocks.coalOre,
  blocks.ironOre
];


