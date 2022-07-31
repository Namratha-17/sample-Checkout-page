export class Product {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    discountedPrice: number;
    afterDiscntTotalPrice: number;

    constructor(){
        this.productId = 0;
        this.productName = '';
        this.productPrice = 0;
        this.quantity = 0;
        this.totalPrice = 0;
        this.discountedPrice = 0;
        this.afterDiscntTotalPrice = 0;
    }
}


export interface Discount {
    productId: number;
    minQuantity: number;
    discountPercentage: number;
    freeProducts: number;
    discountPrice: number;
}
