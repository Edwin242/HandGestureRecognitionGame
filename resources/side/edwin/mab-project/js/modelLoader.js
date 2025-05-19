import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class ModelLoader {
    loader = new GLTFLoader();

    models = {
        pickaxe: undefined,
        steeringWheel: undefined,
        star: undefined,
    }

    loadModels(onLoad) {
        // this.loader.load('http://localhost/side/zach/textures/minecraft_iron_pickaxe.glb', (model) => {
        //     const mesh = model.scene;
        //     this.models.pickaxe = mesh;
        //     onLoad(this.models);
        // })
        this.loader.load('http://localhost/side/zach/textures/steering_wheel.glb', (model) => {
            const mesh2 = model.scene;
            this.models.steeringWheel = mesh2;
            onLoad(this.models);
        })
        // this.loader.load('http://localhost/side/zach/textures/super_star_super_mario_bros.glb', (model) => {
        //     const mesh3 = model.scene;
        //     this.models.star = mesh3;
        //     onLoad(this.models);
        // })
        
    }
}