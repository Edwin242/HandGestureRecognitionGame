import * as THREE from 'three';
import { blocks } from './blocks';
import { Player } from './player';
import { World } from './world';

const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
});

const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

const contactMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 });
const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6);


export class Physics {

    score = 0;
    // Acceleration due to gravity
    gravity = 16;
  
    // Physic simulation rate
    simulationRate = 250;
    stepSize = 1 / this.simulationRate;
    // Accumulator to keep track of leftover dt
    accumulator = 0;
  
    constructor(scene) {
      this.helpers = new THREE.Group();
      this.helpers.visible = false;
      scene.add(this.helpers);
    }
  
    /**
     * Moves the physics simulation forward in time by 'dt'
     * @param {number} dt 
     * @param {Player} player
     * @param {World} world
     */
    update(dt, player, world) {
      this.accumulator += dt;
      while (this.accumulator >= this.stepSize) {
        player.velocity.y -= this.gravity * this.stepSize;
        player.applyInputs(this.stepSize);
        this.detectCollisions(player, world);
        this.accumulator -= this.stepSize;
      }
  
      player.updateBoundsHelper();
    }

    detectCollisions(player, world) {
        player.onGround = false;
        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates, player);

        if (collisions.length > 0) {
            this.resolveCollisions(collisions, player, world);
        }
    }

    broadPhase(player, world)
    {
        const candidates = [];

        const extents = {
            x: {
                min: Math.floor(player.position.x - player.radius),
                max: Math.ceil(player.position.x + player.radius)
            },
            y: {
                min: Math.floor(player.position.y - player.height),
                max: Math.ceil(player.position.y)
            },
            z: {
                min: Math.floor(player.position.z - player.radius),
                max: Math.ceil(player.position.z + player.radius)
            }
        }

        for (let x = extents.x.min; x <= extents.x.max; x++) {
            for (let y = extents.y.min; y <= extents.y.max; y++) {
                for (let z = extents.z.min; z <= extents.z.max; z++) {
                    const blockId = world.getBlock(x, y, z)?.id;
                    if (blockId && blockId !== blocks.empty.id) {
                      const block = { x, y, z};
                      candidates.push(block);
                    //   this.addCollisionHelper(block);
                    }
        
                }
            }
        }

        //console.log(`Broadphase candidates: ${candidates.length}`);

        return candidates;
    }
       narrowPhase(candidates, player) {
        const collisions = [];
        for (const block of candidates) {
        const closestPoint = {
            x: Math.max(block.x - 0.5, Math.min(player.position.x, block.x + 0.5)),
            y: Math.max(block.y - 0.5, Math.min(player.position.y - (player.height / 2), block.y + 0.5)),
            z: Math.max(block.z - 0.5, Math.min(player.position.z, block.z + 0.5))
          };
            // Get distance along each axis between closest point and the center--------------------------------------------------------------/,
            // of the player's bounding cylinder
            const dx = closestPoint.x - player.position.x;
            const dy = closestPoint.y - (player.position.y - (player.height / 2));
            const dz = closestPoint.z - player.position.z;

            if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {

                const overlapY = (player.height / 2) - Math.abs(dy);
                const overlapXZ = player.radius - Math.sqrt(dx * dx + dz *dz);

                let normal, overlap;
                if (overlapY < overlapXZ) {
                    normal = new THREE.Vector3(0, -Math.sign(dy), 0);
                    overlap = overlapY;
                    player.onGround = true;
                } else {
                    normal = new THREE.Vector3(-dx, 0, -dz).normalize();
                    overlap = overlapXZ;
                }
                collisions.push({
                    block,
                    contactPoint: closestPoint,
                    normal,
                    overlap
                  });


                  //this.addContactPointerHelper(closestPoint);
            }
        }
        //console.log(`Narrowphase collisions: ${collisions.length}`)

          return collisions;
    }

    resolveCollisions(collisions, player, world) {
        collisions.sort((a, b) => {
            return a.overlap < b.overlap;
        });
        for (const collision of collisions) {
        if (world.getBlock(collision.block.x, collision.block.y, collision.block.z).id === 15) {
            world.removeBlock(collision.block.x, collision.block.y, collision.block.z);
            world.removeStar(collision.block.x, collision.block.y, collision.block.z);
            this.score += 1000;
            document.getElementById('player-score').innerHTML = "Score: " + this.score;
        }
        // if (world.getBlock(collision.block.x, collision.block.y, collision.block.z).id === 5) {
        //     player.maxSpeed = 25;
        // }
        // else {
        //     player.maxSpeed = 10;
        // }
            if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player) || world.getBlock(collision.block.x, collision.block.y, collision.block.z).id === 9)
                continue;
            let deltaPosition = collision.normal.clone();
            deltaPosition.multiplyScalar(collision.overlap);
            player.position.add(deltaPosition);

            let magnitude = player.worldVelocity.dot(collision.normal);
            let velocityAdjustment = collision.normal.clone().multiplyScalar(magnitude);
            player.applyWorldDeltaVelocity(velocityAdjustment.negate());
        }
        
        
    }

    addCollisionHelper(block) {
        const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
        blockMesh.position.copy(block);
        this.helpers.add(blockMesh);
    }
    addContactPointerHelper(p) {
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
        contactMesh.position.copy(p);
        this.helpers.add(contactMesh);
      }
    
    pointInPlayerBoundingCylinder(p, player) {
        const dx = p.x - player.position.x;
        const dy = p.y - (player.position.y - (player.height / 2));
        const dz = p.z - player.position.z;
        const r_sq = dx * dx + dz * dz;
    
        // Check if contact point is inside the player's bounding cylinder
        return (Math.abs(dy) < player.height / 2) && (r_sq < player.radius * player.radius);
      }

}