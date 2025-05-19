
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import { World } from './world';
// import { resources } from './blocks'

// /**
//  * 
//  * @param {World} world 
//  */
// export function setupUI(scene, world, player) {
//     const gui = new GUI();    

//     const sceneFolder = gui.addFolder('Scene');
//     sceneFolder.add(scene.fog, 'near', 1, 200, 1).name('Fog Near');
//     sceneFolder.add(scene.fog, 'far', 1, 200, 1).name('Fog Far');

//     const scaleFolder = gui.addFolder('Map Scale')
//     scaleFolder.add(world.params, 'mapScale',1000, 1000000, 1000).name('World Scale');
//     scaleFolder.add(world.params, 'amountOfWindows',0, 10, 1).name('Amount of windows');

//     gui.onChange((event) => {
//         world.generate(true);
//     });
// }


