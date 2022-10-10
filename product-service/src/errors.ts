export const NO_PRDUCT_FOUND = 'No product found with given Id';

export class NoProductFound extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
        this.message = NO_PRDUCT_FOUND
    }

}