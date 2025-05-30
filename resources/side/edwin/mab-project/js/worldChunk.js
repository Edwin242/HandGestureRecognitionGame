import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { RNG } from './rng.js';
import { blocks, resources } from './blocks.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';



const geometry = new THREE.BoxGeometry(1, 1, 1);


export class WorldChunk extends THREE.Group {

  constructor(size, params, dataStore) {
    super();
    this.loaded = false;
    this.size = size;
    this.params = params;
    this.dataStore = dataStore;
  }

  /**
   * Parameters for terrain generation
   */


  /**
   * @type {{
   *  id: number,
   *  instanceId: number
   * }[][][]}
   */
  data = [];
  stars = new Map();
  threshold = 0.5;

  /**
   * Generates the world data and meshes
   */
  generate() {
    const start = performance.now();
    const rng = new RNG(this.params.seed);
    this.initialize();
    //this.generateResources(rng);
    this.generateTerrain(rng);
    //this.generateTrees(rng);
    //this.generateClouds(rng);
    this.loadPlayerChanges();
    this.generateMeshes();
    this.loaded = true;
    //console.log(`Loaded chunk in  ${performance.now() - start}ms`);
  }

  /**
   * Initializes an empty world
   */
  initialize() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: blocks.empty.id,
            instanceId: null
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  /**
   * Generates resources within the world
   * @param {RNG} rng Random number generator
   */
  generateResources(rng) {
    for (const resource of resources) {
      const simplex = new SimplexNoise(rng);
      for (let x = 0; x < this.size.width; x++) {
        for (let y = 0; y < this.size.height; y++) {
          for (let z = 0; z < this.size.width; z++) {
            const n = simplex.noise3d(
              (this.position.x + x) / resource.scale.x, 
              (this.position.y + y) / resource.scale.y, 
              (this.position.z + z) / resource.scale.z);

            if (n > resource.scarcity) {
              this.setBlockId(x, y, z, resource.id);
            }
          }
        }
      }
    }
  }

  /**
   * Generates the world terrain data
   * @param {RNG} rng Random number generator
   */
  generateTerrain(rng) {
    // const simplex = new SimplexNoise(rng);
    // for (let x = 0; x < this.size.width; x++) {
    //   for (let z = 0; z < this.size.width; z++) {

    //     // Compute noise value at this x-z location
    //     const value = simplex.noise(
    //       (this.position.x + x) / this.params.terrain.scale,
    //       (this.position.z + z) / this.params.terrain.scale
    //     );

    //     // Scale noise based on the magnitude and add in the offset
    //     const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;

    //     // Compute final height of terrain at this location
    //     let height = scaledNoise;

    //     // Clamp between 0 and max height
    //     height = Math.max(0, Math.min(Math.floor(height), this.size.height - 10));
        
    //     // Starting at the terrain height, fill in all the blocks below that height
    //     for (let y = 0; y < this.size.height; y++) {
    //       if (y <= this.params.terrain.waterOffset && y <= height) {
    //         this.setBlockId(x, y, z, blocks.sand.id);
    //       } else if (y === height) {
    //         this.setBlockId(x, y, z, blocks.grass.id);
    //       // Fill in blocks with dirt if they aren't already filled with something else
    //       } else if (y < height && this.getBlock(x, y, z).id === blocks.empty.id) {
    //         this.setBlockId(x, y, z, blocks.dirt.id);
    //       // Clear everything above
    //       } else if (y > height) {
    //         this.setBlockId(x, y, z, blocks.empty.id);
    //       }
    //     }
    //   }
    // }
    const height = 10;
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        for (let y = 0; y < this.size.height; y++) {
          if (y === height) {
            this.setBlockId(x, y, z, blocks.dirt.id); //the replace in data store works when there isnt grass there, so i just need a way for it to check the data store?
            //console.log(this.dataStore);
          }
          else {
            this.setBlockId(x, y, z, blocks.empty.id);
          }
        }
      }
    }
  }

  
  generateWater() {
    const material = new THREE.MeshLambertMaterial({
      color: 0xe06300,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
    const waterMesh2 = new THREE.Mesh(new THREE.PlaneGeometry(), material)
    waterMesh2.rotateY(-Math.PI / 2.0);
    waterMesh.position.set(
      0, 0, 0
    );
    waterMesh.scale.set(this.size.width, this.size.width, 1);
    waterMesh.layers.set(1);
    this.add(waterMesh);
    waterMesh2.position.set(
      0, 0, 0
    );
    waterMesh2.scale.set(this.size.width, this.size.width, 1);
    waterMesh2.layers.set(1);
    this.add(waterMesh2);
  }
  
  generateClouds(rng) {
    const simplex = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        const value = (simplex.noise(
          (this.position.x + x) / this.params.clouds.scale,
          (this.position.z + z) / this.params.clouds.scale
        ) + 1) * 0.5;

        if ( value < this.params.clouds.density) {
          this.setBlockId(x, this.size.height - 1 , z, blocks.cloud.id);
        }
      }
    }

  }

  loadPlayerChanges() {
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          if (this.dataStore.contains(this.position.x, this.position.z, x, y, z)) {
            if (this.dataStore.get(this.position.x, this.position.z, x, y, z) === 15) {
              console.log("STAR FOUND HERE")
              const blockId = this.dataStore.get(this.position.x, this.position.z, x, y, z);
              this.setBlockId(x, y, z, blockId);
              this.addStar(x, y, z);
            }
            else {
            const blockId = this.dataStore.get(this.position.x, this.position.z, x, y, z);
            this.setBlockId(x, y, z, blockId);
            }
          }
        }
      }
    }
  }


  /**
   * Generates the meshes from the world data
   */
  generateMeshes() {
    this.disposeInstances();
    
    //this.generateWater();
    // Create lookup table of InstancedMesh's with the block id being the key
    const meshes = {};
    Object.values(blocks)
      .filter((blockType) => blockType.id !== blocks.empty.id)
      .forEach((blockType) => {
        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geometry, blockType.material, maxCount);
        mesh.name = blockType.id;
        mesh.count = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes[blockType.id] = mesh;
    });

    // Add instances for each non-empty block
    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.getBlock(x, y, z).id;

          // Ignore empty blocks
          if (blockId === blocks.empty.id) continue;

          const mesh = meshes[blockId];
          const instanceId = mesh.count;

          // Create a new instance if block is not obscured by other blocks
          if (!this.isBlockObscured(x, y, z)) {
            matrix.setPosition(x, y, z);
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    // Add all instanced meshes to the scene
    this.add(...Object.values(meshes));
  }

  /**
   * Gets the block data at (x, y, z)
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {{id: number, instanceId: number}}
   */
  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }
  

  /**
   * Sets the block id for the block at (x, y, z)
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} id
   */
  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }


  /**
   * Sets the block instance id for the block at (x, y, z)
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} instanceId
   */
  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }
  
  /**
   * Checks if the (x, y, z) coordinates are within bounds
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {boolean}
   */
  inBounds(x, y, z) {
    if (x >= 0 && x < this.size.width &&
      y >= 0 && y < this.size.height &&
      z >= 0 && z < this.size.width) {
      return true; 
    } else {
      return false;
    }
  }

  /**
   * Returns true if this block is completely hidden by other blocks
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {boolean}
   */
  isBlockObscured(x, y, z) {
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;
  
    // If any of the block's sides is exposed, it is not obscured
    if (up === blocks.empty.id ||
        down === blocks.empty.id || 
        left === blocks.empty.id || 
        right === blocks.empty.id || 
        forward === blocks.empty.id || 
        back === blocks.empty.id) {
      return false;
    } else {
      return true;
    }
  }

  disposeInstances() {
    this.traverse(obj => {
      if (obj.dispose) obj.dispose();
    });
    this.clear();
  }

  removeBlock(x, y, z) {
    const block = this.getBlock(x, y, z)
    //console.log("removing block" + x + " - " + y + " - " + z);
    if (block && block.id !== blocks.empty.id) {
      this.deleteBlockInstance(x, y, z);
      this.setBlockId(x, y, z, blocks.empty.id);
      //this.dataStore.set(this.position.x, this.position.z, x, y, z, blocks.empty.id);
    }
  }

  deleteBlockInstance(x, y, z) {
    const block = this.getBlock(x, y, z);

    if (block.id === blocks.empty.id || block.instanceId === null) return;

    // Get the mesh and instance id of the block
    const mesh = this.children.find((instanceMesh) => instanceMesh.name === block.id);
    const instanceId = block.instanceId;

    // Swapping the transformation matrix of the block in the last position
    // with the block that we are going to remove
    const lastMatrix = new THREE.Matrix4();
    mesh.getMatrixAt(mesh.count - 1, lastMatrix);

    // Updating the instance id of the block in the last position to its new instance id
    const v = new THREE.Vector3();
    v.applyMatrix4(lastMatrix);
    this.setBlockInstanceId(v.x, v.y, v.z, instanceId);

    // Swapping the transformation matrices
    mesh.setMatrixAt(instanceId, lastMatrix);

    // This effectively removes the last instance from the scene
    mesh.count--;

    // Notify the instanced mesh we updated the instance matrix
    // Also re-compute the bounding sphere so raycasting works
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();

    // Remove the instance associated with the block and update the data model
    this.setBlockInstanceId(x, y, z, null);
  }

  
  addBlockInstance(x, y, z) {
    const block = this.getBlock(x, y, z);

    if (block && block.id !== blocks.empty.id && !block.instanceId) {

      const mesh = this.children.find((instanceMesh) => instanceMesh.name === block.id);
      const instanceId = mesh.count++;
      this.setBlockInstanceId(x, y, z, instanceId);
      const matrix = new THREE.Matrix4();
      matrix.setPosition(x, y, z);
      mesh.setMatrixAt(instanceId, matrix);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }

  addBlock(x, y, z, blockId)
  {
    if (this.getBlock(x, y, z).id === blocks.empty.id) {
      this.setBlockId(x, y, z, blockId);
      this.addBlockInstance(x, y, z);
      //this.dataStore.set(this.position.x, this.position.z, x, y, z, blockId);
    }
  }

  replaceBlock(x, y, z, blockId)
  {
    if (this.getBlock(x, y, z).id !== blocks.empty.id)
    {
      this.removeBlock(x, y, z);
      this.addBlock(x, y, z, blockId)
    }
    else{
      this.addBlock(x, y, z, blockId)
    }
  }

  addStar(x, y, z)
  {
    let gltfloader = new GLTFLoader();
    gltfloader.load('http://localhost/side/zach/textures/FuelCanister.glb', (gltf) => {
      let star = gltf.scene;
      star.scale.set(1, 1, 1);
      star.position.set(x, y, z);
      this.add(star);
      this.stars.set(`${x},${y},${z}`, star); //NOTE this could repeat if different chunks have it in same pos, unless its only linked to this chunk actually, it might only be local to this instance

    })
  }

  removeStar(x, y, z)
  {
    const key = `${x},${y},${z}`;
    const star = this.stars.get(key);
    this.remove(star);
    this.stars.delete(key);


      star.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        } //chat says this helps to avoid memory links by correctly disposing of geometries and materials
      });


  }


}