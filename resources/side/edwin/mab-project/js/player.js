import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import { blocks } from './blocks';
import { Tool } from './tool';
const CENTER_SCREEN = new THREE.Vector2;

export class Player {
    radius = 0.5;
    height = 1.75;
    jumpSpeed = 15;
    onGround = false;
    maxSpeed = 10;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();
    #worldVelocity = new THREE.Vector3();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);
    cameraHelper = new THREE.CameraHelper(this.camera);

    raycaster = new THREE.Raycaster(undefined, undefined, 0, 3);
    selectedCoords = null;
    activeBlockId = blocks.empty.id;

    tool = new Tool();

    constructor(scene) {

        this.camera.position.set(0, 16, 0);
        scene.add(this.camera);
        //scene.add(this.cameraHelper);
        this.camera.add(this.tool);


        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this))
        this.raycaster.layers.set(0);
        this.camera.layers.enable(1);
        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({wireframe: true})
        );
        //scene.add(this.boundsHelper);

        const selectionMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.3,
            color: 0xffffa
        });
        const selectionGeometry = new THREE.BoxGeometry(1.01, 1.01, 1.01);
        this.selectionHelper = new THREE.Mesh(selectionGeometry, selectionMaterial);
        scene.add(this.selectionHelper);
    }

    get worldVelocity() {
        this.#worldVelocity.copy(this.velocity);
        this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
        return this.#worldVelocity;
    }

    update(world) {
        this.updateRayCaster(world);
        this.tool.update(); 
    }

    updateRayCaster(world) {
        this.raycaster.setFromCamera(CENTER_SCREEN, this.camera);
        const intersections = this.raycaster.intersectObject(world, true);

        if (intersections.length > 0) {
            const intersection = intersections[0];

            const chunk = intersection.object.parent;

            const blockMatrix = new THREE.Matrix4();
            //intersection.object.getMatrixAt(intersection.instanceId, blockMatrix); //commented out because of the stars currently breaking it when the ray caster tries to interact with them

            this.selectedCoords = chunk.position.clone();
            this.selectedCoords.applyMatrix4(blockMatrix);

            if (this.activeBlockId != blocks.empty.id) {
                this.selectedCoords.add(intersection.normal);
            }
            this.selectionHelper.position.copy(this.selectedCoords);
            this.selectionHelper.visible = true;
            //console.log(this.selectedCoords);
        }
        else{
            this.selectedCoords = null;
            this.selectionHelper.visible = false;
        }
    }

    applyWorldDeltaVelocity(dv) {
        dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
        this.velocity.add(dv);
    }
    applyInputs(dt)
    {
        if (this.controls.isLocked) {
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;
            //console.log(this.input);
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y * dt;
            //console.log(this.velocity);
            //document.getElementById('player-positioning').innerHTML = this.toString();
        }
    }

    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    get position(){
        return this.camera.position;
    }

    onKeyDown(event)
    {
        if (!this.controls.isLocked) {
            //this.controls.lock();
            //console.log('controls locked')
        }
        //console.log('key down');
        switch(event.code) {
            case 'Digit0':
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
                document.getElementById(`toolbar-${this.activeBlockId}`).classList.remove('selected');
                this.activeBlockId = Number(event.key);
                document.getElementById(`toolbar-${this.activeBlockId}`).classList.add('selected');
                

                this.tool.visible = (this.activeBlockId === 0);
                this.activeBlockId = Number(event.key);
                //console.log(`activeBlockId = ${event.key}`)
                break;
            case 'KeyW':
                this.input.z = this.maxSpeed;
                //console.log('w pressed')
                break;
            case 'KeyA':
                this.input.x = -this.maxSpeed;
                break;
            case 'KeyS':
                this.input.z = -this.maxSpeed;
                break;
            case 'KeyD':
                this.input.x = this.maxSpeed;
                break;
            case 'KeyR':
                this.position.set(0, 16, 0);
                this.velocity.set(0, 0, 0);
                break;
            case 'Space':
                if (this.onGround) {
                    this.velocity.y += this.jumpSpeed;
                }
                break;
        }
    }

    onKeyUp(event)
    {   
        switch(event.code) {

            case 'KeyW':
                this.input.z = 0;
                break;
            case 'KeyA':
                this.input.x = 0;
                break;
            case 'KeyS':
                this.input.z = 0;
                break;
            case 'KeyD':
                this.input.x = 0;
                break;
        }
        //console.log('key up');
    }

    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)} `;
        str += `Y: ${this.position.y.toFixed(3)} `;
        str += `Z: ${this.position.z.toFixed(3)}`;
        return str;
      }
}