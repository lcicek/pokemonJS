export class Bag {
    constructor() { // TODO: consider implementing item:count system
        this.contents = [] // TODO: add several bag sections.
    }

    add(item) {
        this.contents.push(item)
    }

    remove(item) {
        this.contents.remove(item)
    }
}