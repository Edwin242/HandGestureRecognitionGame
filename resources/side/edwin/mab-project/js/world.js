import * as THREE from 'three';
import { WorldChunk } from './worldChunk';
import { DataStore } from './dataStore';
import { blocks, resources } from './blocks.js';
import { RNG } from './rng.js';
export class World extends THREE.Group {

  asyncLoading = true;

  drawDistance = 1;

  chunkSize = {
    width: 32,
    height: 32
  }

  previouslyLoadedChunks = new Set(["0 0"])


  abs = Math;

  params = {
    mapScale: 150000,
    amountOfWindows: 1,
    seed: 0,
    terrain: {
      scale: 30,
      magnitude: 10,
      offset: 10,
      waterOffset: 10
    },
    trees: {
      trunk: {
        minHeight: 4,
        maxHeight: 5
      },
      canopy: {
        minRadius: 2,
        maxRadius: 4,
        density: 0.5
      },
      frequency: 0.01
    },
    clouds: {
      scale: 30,
      density: 0.5
    }
  };

  save() {
    localStorage.setItem('minecraft_params', JSON.stringify(this.params));
    localStorage.setItem('minecraft_data', JSON.stringify(this.dataStore.data));
    document.getElementById('status').innerHTML = 'Game Saved';
    setTimeout(() => document.getElementById('status').innerHTML = '', 3000);
  }

  load() {
    this.params = JSON.parse(localStorage.getItem('minecraft_params'));
    this.dataStore.data = JSON.parse(localStorage.getItem('minecraft_data'));
    document.getElementById('status').innerHTML = 'Game loaded';
    setTimeout(() => document.getElementById('status').innerHTML = '', 3000);
    this.generate();
  }

  dataStore = new DataStore();

  constructor(seed = 0) {
    super();
    this.seed = seed;
    document.addEventListener('keydown', (ev) => {
      switch (ev.code) {
        case 'F1':
          this.save();
          break;
        case 'F2':
          this.load();
          break;
      }
    });
  }

  async generate(clearCache = false) {
    if (clearCache) {
      this.dataStore.clear();
    }
  
    this.disposeChunks();
    for (let x = -this.drawDistance; x <= this.drawDistance; x++) {
      for (let z = -this.drawDistance; z <= this.drawDistance; z++) {
        const chunk = new WorldChunk(this.chunkSize, this.params, this.dataStore);
        chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
        chunk.userData = { x, z };
        chunk.generate();
        this.add(chunk);
      }
    }
    // this.initializeWalls();
    this.fetchJSONData();
  }

  getVisibleChunks(player)
  {
    const visibleChunks = [];

    const coords = this.worldToChunkCoords(
      player.position.x,
      player.position.y,
      player.position.z
    );

    const chunkX = coords.chunk.x;
    const chunkZ = coords.chunk.z;

    for (let x = chunkX - this.drawDistance; x <= chunkX + this.drawDistance; x++) {
      for (let z = chunkZ - this.drawDistance; z <= chunkZ + this.drawDistance; z++) {
        visibleChunks.push({x, z});
      }
    }

    return visibleChunks;
  }

  

  getChunksToAdd(visibleChunks) {
    // Filter down visible chunks, removing ones that already exist
    return visibleChunks.filter((chunk) => {
      const chunkExists = this.children
        .map((obj) => obj.userData)
        .find(({ x, z }) => {
          return chunk.x === x && chunk.z === z
        });

      return !chunkExists;
    })
  }

  update(player){
    const visibleChunks = this.getVisibleChunks(player);
    const chunksToAdd = this.getChunksToAdd(visibleChunks);
    this.removeUnusedChunks(visibleChunks);
    for (const chunk of chunksToAdd) {
      this.generateChunk(chunk.x, chunk.z);
    }

  }



  worldToChunkCoords(x, y, z) {
    const chunkCoords = {
      x: Math.floor(x / this.chunkSize.width),
      z: Math.floor(z / this.chunkSize.width),
    };

    const blockCoords = {
      x: x - this.chunkSize.width * chunkCoords.x,
      y,
      z: z - this.chunkSize.width * chunkCoords.z
    };
    return {
      chunk: chunkCoords,
      block: blockCoords
    }
  }
  removeUnusedChunks(visibleChunks) {
    const chunksToRemove = this.children.filter((chunk) => {
      const { x, z } = chunk.userData;
      const chunkExists = visibleChunks
        .find((visibleChunk) => (
           visibleChunk.x === x && visibleChunk.z === z
        ));

      return !chunkExists;
    });
    for (const chunk of chunksToRemove) {
      //console.log(chunk);
      chunk.disposeInstances();
      this.remove(chunk);
      //console.log(`Removing chunk at X: ${chunk.userData.x} Z: ${chunk.userData.z}`);
    }
  }

  async generateChunk(x, z) {
    //console.log("generating new chunk");
    const start = performance.now();
    let retrieveDataStoreBlocks = false;
    const chunk = new WorldChunk(this.chunkSize, this.params, this.dataStore);
    chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
    //console.log(x + "   -   " + z); //its setting the chunk position as the absolute block position of the chunk i see
    chunk.userData = { x, z };
    const blocks = this.retrieveBlocksFromDataStore(x, z); //IS THIS ALWAYS REFERRING TO CHUNK 0 0???????
    if (this.previouslyLoadedChunks.has(x + " " + z)) {
    }
    else {
      retrieveDataStoreBlocks = true;
    }
    this.previouslyLoadedChunks.add(x + " " + z)
    for (let i = 0; i < blocks.length; i++) {
    }
    if (this.asyncLoading) {
      requestIdleCallback(chunk.generate.bind(chunk), { timeout: 1000 })
    }
    else {
      chunk.generate();
    }
    this.add(chunk);
    if (retrieveDataStoreBlocks)
    {
    await this.delay(2000);
    // for (let i = 0; i < blocks.length; i++)
    // {
    //   const block = blocks[i];
    //   this.addBlockToChunk(block.chunkX, block.chunkZ, block.blockX, block.blockY, block.blockZ, block.blockId);
    // }
  }
  const end = performance.now();
  const duration = end - start;
  //console.log(this.dataStore.size());
  // console.log(`Time taken for whole chunk: ${duration.toFixed(3)}ms`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  retrieveBlocksFromDataStore(chunkX, chunkZ) {
    const start = performance.now();
    let counter = 0;
    const blocks = [];
    const { width, height } = this.chunkSize; 

    for (let blockX = 0; blockX < width; blockX++) {
        for (let blockY = 0; blockY < height; blockY++) {
            for (let blockZ = 0; blockZ < width; blockZ++) {
              counter++;
              if (this.dataStore.contains(chunkX, chunkZ, blockX, blockY, blockZ))
              {
                const blockId = this.dataStore.get(chunkX, chunkZ, blockX, blockY, blockZ);
                if (blockId !== undefined) {
                    blocks.push({ chunkX, chunkZ, blockX, blockY, blockZ, blockId });
                }
            }
          }
        } 
    }
    const end = performance.now();
    const duration = end - start;
    // console.log(`Time taken: ${duration.toFixed(3)}ms`);
    // console.log(counter);
    // console.log(this.dataStore.size())
    return blocks;
}

delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  getChunk(chunkX, chunkZ) {
    return this.children.find((chunk) => {
      return chunk.userData.x === chunkX &&
        chunk.userData.z === chunkZ;
    });
  }

  getBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      return chunk.getBlock(
        coords.block.x,
        coords.block.y,
        coords.block.z
      );
    }
    else {
      return null;
    }
  }

  addBlock(x, y, z, blockId)
  {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk && chunk.loaded) {
      //console.log(coords.chunk.x + "  " + coords.chunk.z)
      chunk.addBlock(
        coords.block.x,
        coords.block.y,
        coords.block.z,
        blockId
      );
      this.dataStore.set((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, coords.block.y, coords.block.z, blockId);
      //hide adjacent neighbours
      this.revealBlock(x - 1, y, z);
      this.revealBlock(x + 1, y, z);
      this.revealBlock(x, y - 1, z);
      this.revealBlock(x, y + 1, z);
      this.revealBlock(x, y, z - 1);
      this.revealBlock(x, y, z + 1);
  }
  else
  {
    this.dataStore.set((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, coords.block.y, coords.block.z, blockId);
  }
}

async addBlockToChunk(chunkX, chunkZ, x, y, z, blockId)
{
  const chunk = this.getChunk(chunkX, chunkZ);
  if (chunk && chunk.loaded) {
    chunk.replaceBlock(x, y, z, blockId);
    if (blockId === 15) {
      chunk.addStar(x, y, z);
    }
}
}

replaceBlock(x, y, z, blockId)
  {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      chunk.removeBlock(
        coords.block.x,
        coords.block.y,
        coords.block.z
      );
      chunk.addBlock(
        coords.block.x,
        coords.block.y,
        coords.block.z,
        blockId
      );
      this.dataStore.set((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, coords.block.y, coords.block.z, blockId);
      //hide adjacent neighbours
      this.revealBlock(x - 1, y, z);
      this.revealBlock(x + 1, y, z);
      this.revealBlock(x, y - 1, z);
      this.revealBlock(x, y + 1, z);
      this.revealBlock(x, y, z - 1);
      this.revealBlock(x, y, z + 1);

  }
  else
  {
    this.dataStore.set((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, coords.block.y, coords.block.z, blockId);
  }
}

  disposeChunks() {
    this.traverse((chunk) => {
      if (chunk.disposeInstances) {
        chunk.disposeInstances();
      }
    });
    this.clear();
  }

  removeBlock(x, y, z) {
    //console.log("removing block through world remove block method");
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    if (chunk) {
      chunk.removeBlock(
        coords.block.x,
        coords.block.y,
        coords.block.z
      );
      this.dataStore.set((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, coords.block.y, coords.block.z, 0);

    this.revealBlock(x - 1, y, z);
    this.revealBlock(x + 1, y, z);
    this.revealBlock(x, y - 1, z);
    this.revealBlock(x, y + 1, z);
    this.revealBlock(x, y, z - 1);
    this.revealBlock(x, y, z + 1);
    }
  }

  revealBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk) {
        chunk.addBlockInstance(
          coords.block.x,
          coords.block.y,
          coords.block.z
        );
    }
  }

  
  hideBlock(x, y, z) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.isBlockObscured(coords.block.x,coords.block.y,coords.block.z)) {
        chunk.deleteBlockInstance(
          coords.block.x,
          coords.block.y,
          coords.block.z
        );
    }
  }



 convertCoords(lat, lon, startingCoords) {
    // Example conversion - modify based on your scale and coordinate system
    const scale = this.params.mapScale; // Adjust this based on your world scale
    const originLat = startingCoords[1]; // Example origin latitude
    const originLon = startingCoords[0]; // Example origin longitude
    // Convert latitude/longitude to offset from origin
    const x = Math.floor((lon - originLon) * scale);
    const y = Math.floor((originLat - lat) * scale); //research why this worked maybe
  
    return { x, y };
  }


  buildWindows(wallLength, wallHeight, x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = Math.sign(x1 - x0);
    const sy = Math.sign(y1 - y0);
    let err = dx - dy;
    let h = Math.round(wallHeight / 2);
    if (this.params.amountOfWindows > 0)
    {
      this.params.amountOfWindows++;
    let w = Math.round(wallLength / (this.params.amountOfWindows)); //change walls
    let wCounter = 0;
    let hCounter = 0;
    while (true) {
      for (let i = 11; i < 11 + wallLength; i++) {
        if (wCounter === w - 1 || wCounter === w || wCounter === w + 1) {
          while (hCounter < wallHeight)
          {
            if (hCounter === (h - 1)) {
              this.removeBlock(x0, hCounter + 11, y0)
              this.removeBlock(x0, hCounter + 12, y0)
              this.removeBlock(x0, hCounter + 13, y0)
              this.addBlock(x0, hCounter + 11, y0, blocks.glass.id)
              this.addBlock(x0, hCounter + 12, y0, blocks.glass.id)
              this.addBlock(x0, hCounter + 13, y0, blocks.glass.id)
            }

            hCounter++;
            }
          if (wCounter === w + 1)
            w = w + w;

        }
      }
      wCounter++;
      hCounter = 0;
      if (x0 === x1 && y0 === y1) {
        break;
      }

      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; } // this is what steps along and updates it and determine which diretion the line should go in next
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }
  }

line(windows, door, wallHeight, blockType, x0, y0, x1, y1) {
  let lineBlocks = [];
  let x00 = x0;
  let y00 = y0;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;
  let wallLength = 0;
  while (true) {
    wallLength++;
    for (let i = 11; i < 11 + wallHeight; i++)
    this.addBlock(x0, i, y0, blocks[blockType].id); // Do what you need to for this
    lineBlocks.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) {
      //this.replaceBlock(x0, wallHeight + 11, y0, blocks.stone.id);
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; } // this is what steps along and updates it and determine which diretion the line should go in next
    if (e2 <  dx) { err += dx; y0 += sy; }
  }
 if (windows)
 {
  //this.buildWindows(wallLength, wallHeight, x00, y00, x1, y1);
  const windowNum = Math.round(wallLength / 8);
  const windowGap = Math.round(wallLength / (windowNum + 1))
  for (let i = 0; i < windowNum; i++) {
    this.replaceBlock(lineBlocks[windowGap * (i + 1)].x, 12, lineBlocks[windowGap * (i + 1)].y, blocks.glass.id);

  }
}
 if (door) {
  const half = Math.round(lineBlocks.length / 2)
  this.replaceBlock(lineBlocks[half].x, 11, lineBlocks[half].y, blocks.cloud.id);
  this.replaceBlock(lineBlocks[half].x, 12, lineBlocks[half].y, blocks.cloud.id);
  this.replaceBlock(lineBlocks[half].x, 13, lineBlocks[half].y, blocks.cloud.id);
  this.replaceBlock(lineBlocks[half - 1].x, 11, lineBlocks[half - 1].y, blocks.cloud.id);
  this.replaceBlock(lineBlocks[half - 1].x, 12, lineBlocks[half - 1].y, blocks.cloud.id);
  this.replaceBlock(lineBlocks[half - 1].x, 13, lineBlocks[half - 1].y, blocks.cloud.id);
 }
}

buildRoof(wallHeight, blockType, x0, y0, x1, y1) {
  let x00 = x0;
  let y00 = y0;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;
  let wallLength = 0;
  while (true) {
    wallLength++;
    this.addBlock(x0, wallHeight + 11, y0, blocks[blockType].id); // Do what you need to for this
    this.addBlock(x0, wallHeight + 11, y0 - 1, blocks[blockType].id);
    this.addBlock(x0, wallHeight + 11, y0 + 1, blocks[blockType].id);
    

    if (x0 === x1 && y0 === y1) {
      //this.replaceBlock(x0, wallHeight + 12, y0, blocks.stone.id);
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; } // this is what steps along and updates it and determine which diretion the line should go in next
    if (e2 <  dx) { err += dx; y0 += sy; }
  }
}

path(blockType, pathWidth, x0, y0, x1, y1) {
  pathWidth--;
  //pathwidth is currently 2
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;
  while (true) { //this is infinite

    this.replaceBlock(x0, 10, y0, blocks[blockType].id); // Do what you need to for this
    if (x0 === x1 && y0 === y1) {
      break;
    }
    const x02 = x0;
    const y02 = y0;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; } // this is what steps along and updates it and determine which diretion the line should go in next
    if (e2 <  dx) { err += dx; y0 += sy; }
    if (x02 === x0 && y02 !== y0)
    {
      for (let i = 1; i < (pathWidth + 1); i++) {
      this.replaceBlock(x02 + i, 10, y02, blocks[blockType].id);
      this.replaceBlock(x02 - i, 10, y02, blocks[blockType].id);
      }
    }
    else if (x02 !== x0 && y02 === y0)
    {
      for (let i = 1; i < (pathWidth + 1); i++) {
      this.replaceBlock(x02, 10, y02 + i, blocks[blockType].id);
      this.replaceBlock(x02, 10, y02 - i, blocks[blockType].id);
      }
    }
    else {
      for (let i = 1; i < (pathWidth + 1); i++) {
      this.replaceBlock(x02 + i, 10, y02, blocks[blockType].id);
      this.replaceBlock(x02 - i, 10, y02, blocks[blockType].id);
      this.replaceBlock(x02, 10, y02 + i, blocks[blockType].id);
      this.replaceBlock(x02, 10, y02 - i, blocks[blockType].id);
      }
    }
  }
}

road(x0, y0, x1, y1, plane) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;
  //console.log(plane);
  while (true) {
    if (plane === "x") {
    this.replaceBlock(x0, 10, y0, blocks.road4.id);
    this.replaceBlock(x0 + 1, 10, y0, blocks.road3.id);
    this.replaceBlock(x0 + 2, 10, y0, blocks.road2.id);
    this.replaceBlock(x0 + 3, 10, y0, blocks.road1.id);
    this.replaceBlock(x0 - 1, 10, y0, blocks.road5.id);
    this.replaceBlock(x0 - 2, 10, y0, blocks.road6.id);
    this.replaceBlock(x0 - 3, 10, y0, blocks.road7.id);
    }
    else if (plane === "y") {
      this.replaceBlock(x0, 10, y0, blocks.road4y.id);
      this.replaceBlock(x0, 10, y0 + 1, blocks.road3y.id);
      this.replaceBlock(x0, 10, y0 + 2, blocks.road2y.id);
      this.replaceBlock(x0, 10, y0 + 3, blocks.road1y.id);
      this.replaceBlock(x0, 10, y0 - 1, blocks.road5y.id);
      this.replaceBlock(x0, 10, y0 - 2, blocks.road6y.id);
      this.replaceBlock(x0, 10, y0 - 3, blocks.road7y.id);
    }

    if (x0 === x1 && y0 === y1) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; } // this is what steps along and updates it and determine which diretion the line should go in next
    if (e2 <  dx) { err += dx; y0 += sy; }
  }
}


fetchJSONData() {
  fetch("http://localhost/side/zach/mab.geojson")
      .then((res) => {
          if (!res.ok) {
              throw new Error 
                  (`HTTP error! Status: ${res.status}`);
          }
          return res.json();
      })
    .then((data) => {
      let startingCoords;
      for (let i = 0; i < data.features.length; i++) {
        const feature = data.features[i]
        if (feature.geometry.type === "Point") {
          if (feature.properties.startingPoint === "true") {
            startingCoords = feature.geometry.coordinates;
            break;
          }
        }
      }


            for (let i = 0; i < data.features.length; i++ ) {
              const feature = data.features[i]
              if (feature.geometry.type === "Polygon")
              {
                const geometry = feature.geometry;
                const coordinates = geometry.coordinates;
                const properties = feature.properties;
                if (properties.type === "building") {
                this.drawPolygon(properties, coordinates[0], startingCoords);
                }
                else if (properties.type === "parklands") {
                  this.drawParklandsPolygon(coordinates[0], startingCoords);
                }
                else if (properties.type === "coinArea")
                {
                  this.createCoins(properties.amountOfCoins, properties.validCoinType, coordinates[0], startingCoords);
                }
              }
              if (feature.geometry.type === "LineString") {
                const geometry = feature.geometry;
                const coordinates = geometry.coordinates;
                const properties = feature.properties;
                if (properties.type === "path") {
                  this.drawPath(coordinates, startingCoords, properties.pathType, properties.pathWidth)

                }
                if (properties.type === "road") {
                  console.log(properties.plane);
                  this.drawRoad(coordinates, startingCoords, properties.plane)
                }
              }
              if (feature.geometry.type === "Point") {
                if (feature.properties.coin === "true")
                {
                  //trees will override coins if they are found after as they will still have grass under them which is what allows the tree to spawn and the wood uses replace not add
                  this.createCoin(feature.geometry.coordinates, startingCoords);
                }

              }
            }
              this.dataStore.size()
      })


      

      .catch((error) => 
             console.error("Unable to fetch data:", error));

}

async createCoin(coinCoords, startingCoords)
{
  const location = this.convertCoords(coinCoords[1], coinCoords[0], startingCoords);
  //this.addBlock(location.x, 11, location.y, blocks.coin.id);
  this.addStar(location.x, 14, location.y);
  
}

 
  generateTreeTrunk(x, z, rng) {
   if  (this.checkTreeValidity(x, z) === true)
   {
    const minH = this.params.trees.trunk.minHeight;
    const maxH = this.params.trees.trunk.maxHeight;
    const h = Math.round(minH + (maxH - minH) * rng.random());
 //the height of the grass blocks is 10
      // const block = this.getBlock(x, 10, z);
      // if (block) {
      // if (block.id === blocks.grass.id  ) {
        for (let treeY = 10 + 1; treeY <= 10 + h; treeY++)
        {
          this.addBlock(x, treeY, z, blocks.tree.id)
        }
        this.replaceBlock(x, 10, z, blocks.tree.id) //add an underground wooden block for the algorithm to stop trees spawning next to each other as it checks for valid grass befre spawning one
        this.generateTreeCanopy(x, 10 + h, z, rng);
    //   }
    // }
  
  }
}
  generateTreeCanopy(centerX, centerY, centerZ, rng) {
    const minR = this.params.trees.canopy.minRadius;
    const maxR = this.params.trees.canopy.maxRadius;
    const r = Math.round(minR + (maxR- minR) * rng.random());

    for (let x = -r; x <= r; x++) {
      for (let y = -r; y <= r; y++) {
        for (let z = -r; z <= r; z++) {
          const n = rng.random();
          if (x * x + y * y + z * z > r * r) continue;

          const block = this.getBlock(centerX + x,centerY + y,centerZ + z);
          if (block && block.id !== blocks.empty.id) continue;
          if (n < this.params.trees.canopy.density) {
            this.addBlock(centerX + x, centerY + y, centerZ + z, blocks.leaves.id);
          }
        }
      }
    }

  }

  checkTreeValidity(x, z) {
    //console.log("checking da grass");
    // Loop over a square of blocks centered on (x, z) with radius 5
    for (let dx = -5; dx <= 5; dx++) {
      for (let dz = -5; dz <= 5; dz++) {
        const coords = this.worldToChunkCoords(x + dx, 10, z + dz);
        const block = this.dataStore.get((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, 10, coords.block.z);
        //console.log(this.dataStore.get((coords.chunk.x * this.chunkSize.width), (coords.chunk.z * this.chunkSize.width), coords.block.x, 10, coords.block.z))
        // Check if block is grass (1) and exists
        if (!block || block != 1) {
          return false; // Invalid location for tree
        }
      }
    }
    //console.log("valid grass block found");
    return true; // All blocks in the area are grass (1)
  }
  

  fillParklandsPolygon(maxX, minX, maxY, minY, polygon) {
    //console.log("checking parklands");
    let rngN = new RNG(this.params.seed);
    let offset = 30;
    let num = Math.floor(Math.random() * 40);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (this.isPointInPolygon([x, y], polygon)) {
          num++;
          if ((num % offset) === 0)
          {
            num = Math.floor(Math.random() * 40);
         this.generateTreeTrunk(x, y, rngN); // Function to place a block at (x, y)
          }
        }
      }
    }
  }


isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) &&
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

fillPolygon(maxX, minX, maxY, minY, polygon, floorType, height) {
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (this.isPointInPolygon([x, y], polygon)) {
        this.replaceBlock(x, height, y, blocks[floorType].id); // Function to place a block at (x, y)
      }
    }
  }
}


drawPolygon(properties, coords, startingCoords) {
  let polygon = [];
  const first = this.convertCoords(coords[0][1], coords[0][0], startingCoords);
  const second = this.convertCoords(coords[1][1], coords[1][0], startingCoords);
  let highestX = first.x, lowestX = second.x, highestY = first.y, lowestY = second.y;
 
  
  // Draw each line segment
  for (let i = 0; i < coords.length - 1; i++) {
    const start = this.convertCoords(coords[i][1], coords[i][0], startingCoords);
    const end = this.convertCoords(coords[i + 1][1], coords[i + 1][0], startingCoords);
    if (i === 0) {
      polygon.push([start.x, start.y]);
    }
    polygon.push([end.x, end.y]);
    if (start.x > highestX)
        highestX = start.x;
      if (start.x < lowestX)
        lowestX = start.x;
      if (end.x > highestX)
        highestX = end.x;
      if (end.x < lowestX)
        lowestX = end.x;
      if (start.y > highestY)
        highestY = start.y;
      if (start.y < lowestY)
        lowestY = start.y;
      if (end.y > highestY)
        highestY = end.y;
      if (end.y < lowestY)
        lowestY = end.y;
    this.line(properties.windows, properties.door, properties.wallHeight, properties.wallType, start.x, start.y, end.x, end.y);
    if (!properties.greenhouse){
      if (properties.door) {
        properties.door = false;
      }
    }

  }
  this.fillPolygon(highestX, lowestX, highestY, lowestY, polygon, properties.floorType, 10);

  

   //code for putting the points one ach bouding x and y biggest and smallest and then putting a block in the midpoint of the entire structure
  //  this.addBlock(highestX, 15, highestY, blocks.cloud.id);
  //  this.addBlock(lowestX, 15, lowestY, blocks.cloud.id);
  //  this.addBlock(lowestX, 15, highestY, blocks.cloud.id);
  //  this.addBlock(highestX, 15, lowestY, blocks.cloud.id);
   const Xlen = (highestX - lowestX);
   const Ylen = (highestY - lowestY);
   const midpointX = (Xlen / 2);
   const midpointY = (Ylen / 2);
   //this.replaceBlock(Math.floor(highestX - midpointX), 16, Math.floor(highestY - midpointY), blocks.cloud.id);
   const midX = Math.floor(highestX - midpointX);
   const midY = Math.floor(highestY - midpointY);



  if (properties.roofShape === "slanted") {
    // Initialize an array to store the polygons
    const polygons = [];

    // Generate the initial polygon and add it to the array
    polygons[0] = this.getNextRoofLevelCoords(midX, midY, polygon);
    let n = 0;
    while (true) {
      // Draw lines for the current polygon
      const currentPolygon = polygons[n];
      let roofHeight = properties.wallHeight + Math.floor((n / properties.roofPitch));
      for (let i = 0; i < currentPolygon.length - 1; i++) {
        let roofFinished = true;
        for (let b = 1; b < currentPolygon.length; b++) {
          let x = currentPolygon[0][0];
          let y = currentPolygon[0][1];
          if (x !== currentPolygon[b][0] || y !== currentPolygon[b][1]) {
            roofFinished = false;
            break;
          }
        }
        if (roofFinished) {
          return;
        }

        this.buildRoof(
          roofHeight,
          properties.roofType,
          currentPolygon[i][0],
          currentPolygon[i][1],
          currentPolygon[i + 1][0],
          currentPolygon[i + 1][1]
        );
      }
      // Generate the next polygon and add it to the array
      polygons[n + 1] = this.getNextRoofLevelCoords(midX, midY, currentPolygon);
      n++;
    }
  }

  else if (properties.roofShape === "flat") {
    this.fillPolygon(highestX, lowestX, highestY, lowestY, polygon, properties.roofType, properties.wallHeight + 11)
  }

  // Close the polygon

}


getNextRoofLevelCoords(midX, midY, polygon) {

  let polygon2 = polygon.map(subArray => subArray.slice());

  for (let i = 0; i < polygon.length; i++)
  {
   let coordX = polygon[i][0];
   let coordY = polygon[i][1];
   if (coordX  < midX) {
     coordX++;
   }
   else if (coordX > midX)
   {
     coordX--;
   }
   if (coordY < midY) {
     coordY++;
   }
   else if (coordY > midY){
     coordY--;
   }
   polygon2[i][0] = coordX;
   polygon2[i][1] = coordY;
   
   //if its less then the x it increases toward it
   //if it is less then the y it increases towar it
   //if it is more then the  x it decreases toward it
   //if it is more then the y it decreases towards it
  }
  return polygon2;
  
}
drawParklandsPolygon(coords, startingCoords) {
  // Draw each line segment
  let polygon = [];
  const first = this.convertCoords(coords[0][1], coords[0][0], startingCoords);
  const second = this.convertCoords(coords[1][1], coords[1][0], startingCoords);
  let highestX = first.x, lowestX = second.x, highestY = first.y, lowestY = second.y;
  for (let i = 0; i < coords.length - 1; i++) {
    const start = this.convertCoords(coords[i][1], coords[i][0], startingCoords);
    const end = this.convertCoords(coords[i + 1][1], coords[i + 1][0], startingCoords);
    if (i === 0) {
      polygon.push([start.x, start.y]);
    }
    polygon.push([end.x, end.y]);
    if (start.x > highestX)
        highestX = start.x;
      if (start.x < lowestX)
        lowestX = start.x;
      if (end.x > highestX)
        highestX = end.x;
      if (end.x < lowestX)
        lowestX = end.x;
      if (start.y > highestY)
        highestY = start.y;
      if (start.y < lowestY)
        lowestY = start.y;
      if (end.y > highestY)
        highestY = end.y;
      if (end.y < lowestY)
        lowestY = end.y;
    //this.line("false", 1, "concrete", start.x, start.y, end.x, end.y);
  }
  this.fillParklandsPolygon(highestX, lowestX, highestY, lowestY, polygon);
  //this.addBlock(highestX, 15, highestY, blocks.cloud.id);
  //this.addBlock(lowestX, 15, lowestY, blocks.cloud.id);
  // Close the polygon
}

 createCoins(amountOfCoins, validCoinType, coords, startingCoords) {
//first i can do it so it goes ahead and maps the positions of all the grass blocks  and stores that data in an array, then it splits that array into
//however many seperate smaller arrays for the amountOfCoins there is, then goes through each and places a coin in a random spot
  // Draw each line segment
  let polygon = [];
  const first = this.convertCoords(coords[0][1], coords[0][0], startingCoords);
  const second = this.convertCoords(coords[1][1], coords[1][0], startingCoords);
  let highestX = first.x, lowestX = second.x, highestY = first.y, lowestY = second.y;
  for (let i = 0; i < coords.length - 1; i++) {
    const start = this.convertCoords(coords[i][1], coords[i][0], startingCoords);
    const end = this.convertCoords(coords[i + 1][1], coords[i + 1][0], startingCoords);
    if (i === 0) {
      polygon.push([start.x, start.y]);
    }
    polygon.push([end.x, end.y]);
    if (start.x > highestX)
        highestX = start.x;
      if (start.x < lowestX)
        lowestX = start.x;
      if (end.x > highestX)
        highestX = end.x;
      if (end.x < lowestX)
        lowestX = end.x;
      if (start.y > highestY)
        highestY = start.y;
      if (start.y < lowestY)
        lowestY = start.y;
      if (end.y > highestY)
        highestY = end.y;
      if (end.y < lowestY)
        lowestY = end.y;
  } 
  this.fillCoins(highestX, lowestX, highestY, lowestY, polygon, amountOfCoins, validCoinType);

}

fillCoins(maxX, minX, maxY, minY, polygon, amountOfCoins, validCoinType) {
  let grassBlocks = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const block = this.getBlock(x, 10, y);
      if (block !== null)
      {
      if (this.isPointInPolygon([x, y], polygon) && block.id === blocks[validCoinType].id && this.getBlock(x, 11, y).id === 0 && this.getBlock(x, 12, y).id === 0) {
        grassBlocks.push([x, y])
      }
      }
      else {
        const block10 = this.worldToChunkCoords(x, 10, y);
        if (this.dataStore.contains((block10.chunk.x * this.chunkSize.width), (block10.chunk.z * this.chunkSize.width), block10.block.x, block10.block.y, block10.block.z))
        {
          if (this.dataStore.get((block10.chunk.x * this.chunkSize.width), (block10.chunk.z * this.chunkSize.width), block10.block.x, block10.block.y, block10.block.z) === blocks[validCoinType].id
        && (this.dataStore.contains((block10.chunk.x * this.chunkSize.width), (block10.chunk.z * this.chunkSize.width), block10.block.x, block10.block.y + 1, block10.block.z) === false)
      && (this.dataStore.contains((block10.chunk.x * this.chunkSize.width), (block10.chunk.z * this.chunkSize.width), block10.block.x, block10.block.y + 2, block10.block.z) === false))
      {
        grassBlocks.push([x, y]);
      }
          //it needs to check if there is a block there (maybe not if the get can handle an undefined, then check if there is anything above the next 2 like its 
          //been done above then it will be able to add that to the array grassBlocks)
        }
      }
    }
  }
  //console.log(grassBlocks.length);
  const newArrLength = Math.floor(grassBlocks.length / amountOfCoins);
  //console.log(newArrLength);

  for (let i = 0; i < amountOfCoins; i++)
  {
  const randomIndex = Math.floor(Math.random() * newArrLength) + (newArrLength * (i));
  //console.log(randomIndex);
  this.addStar(grassBlocks[randomIndex][0], 12, grassBlocks[randomIndex][1]);
  this.addBlock(grassBlocks[randomIndex][0], 12, grassBlocks[randomIndex][1], blocks.coin.id);


  }

}


drawPath(coords, startingCoords, pathType, pathWidth) {
  // Draw each line segment
  for (let i = 0; i < coords.length - 1; i++) {
    const start = this.convertCoords(coords[i][1], coords[i][0], startingCoords);
    const end = this.convertCoords(coords[i + 1][1], coords[i + 1][0], startingCoords);
    this.path(pathType, pathWidth, start.x, start.y, end.x, end.y);
  }

}

drawRoad(coords, startingCoords, plane) {
  for (let i = 0; i < coords.length - 1; i++) {
    const start = this.convertCoords(coords[i][1], coords[i][0], startingCoords);
    const end = this.convertCoords(coords[i + 1][1], coords[i + 1][0], startingCoords);
    this.road(start.x, start.y, end.x, end.y, plane);
  }


}
addStar(x, y, z)
{
  const coords = this.worldToChunkCoords(x, y, z);
  const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
  //console.log(coords);
  if (chunk && chunk.loaded) {
    chunk.addStar(
      coords.block.x,
      coords.block.y,
      coords.block.z,
    );
}
else {
}

}

removeStar(x, y, z) {
  const coords = this.worldToChunkCoords(x, y, z);
  const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
  if (chunk && chunk.loaded) {
    chunk.removeStar(
      coords.block.x,
      coords.block.y,
      coords.block.z,
    );
}
}


}