export class DataStore {
    constructor() {
        this.data = {};
    }
    clear() {
        console.log("cleared")
        this.data = {};
    }

    contains(chunkX, chunkZ, blockX, blockY, blockZ) {
        const key = this.getKey(chunkX, chunkZ, blockX, blockY, blockZ);
        return this.data[key] !== undefined;
    }

    get(chunkX, chunkZ, blockX, blockY, blockZ) {
        const key = this.getKey(chunkX, chunkZ, blockX, blockY, blockZ);
        if (this.data[key] === undefined) {
            console.warn(`Block not found for key ${key}, DataStore:`, this.data);
        }
        return this.data[key];
    }
    

    set (chunkX, chunkZ, blockX, blockY, blockZ, blockId) {
        const key = this.getKey(chunkX, chunkZ, blockX, blockY, blockZ);
        this.data[key] = blockId;
        //console.log("generating");

    }

    getKey(chunkX, chunkZ, blockX, blockY, blockZ ) {
        return `${chunkX}-${chunkZ}-${blockX}-${blockY}-${blockZ}`;
    }

    size() {
        console.log(Object.keys(this.data).length);
        console.log(this.data)
    }
}