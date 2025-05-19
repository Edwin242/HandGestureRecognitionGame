import * as THREE from 'three';

export class Tool extends THREE.Group{
    animationAmplitude = 0.5;
    animationDuration = 674.0;
    animate = false;
    animationStart = 0;
    animationSpeed = 0.025;
    animation = undefined; //currently active animation
    toolMesh = undefined; //3D mesh of the actual tool

get animationTime() {
    return performance.now() - this.animationStart;
}

startAnimation() {
    if (this.animate) return;
    this.animate = true;
    this.animationStart = performance.now();
    clearTimeout(this.animate);
        
    this.animation = setTimeout(() => {
        this.animate = false;
    }, this.animationDuration);

}

right() {
    this.toolMesh.rotation.z -= .1;
}
left() {
    this.toolMesh.rotation.z += .1;
}


update() {
    if (this.animate && this.toolMesh) {
        this.toolMesh.rotation.z = this.animationAmplitude * Math.sin(this.animationTime * this.animationSpeed);

    }
}

    setMesh(mesh) {
        this.clear();
        this.toolMesh = mesh;
        this.add(this.toolMesh);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        this.position.set(0, -10, 0);
        this.scale.set(0.03, 0.03, 0.03)
        
    }
}