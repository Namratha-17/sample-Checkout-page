import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Discount, Product } from '../Dtos/ProductDto';

const PRODUCT_DATA: Product[] = [
  { productId: 1, productName: 'Kone', productPrice: 3488.99, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 },
  { productId: 2, productName: 'Ironhide Cartridge', productPrice: 529.99, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 },
  { productId: 3, productName: 'Ironhide', productPrice: 3299.99, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 },
  { productId: 4, productName: 'Fox + Float', productPrice: 66.00, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 },
  { productId: 5, productName: 'Shimano+ Derailuer', productPrice: 67.60, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 },
  { productId: 6, productName: 'SANTA CRUZ', productPrice: 185.50, quantity: 0, totalPrice: 0, discountedPrice: 0, afterDiscntTotalPrice: 0 }
];

const DISCOUNT_DATA: Discount[] = [
  { productId: 1, minQuantity: 3, discountPercentage: 0, freeProducts: 0, discountPrice: 2588.99 },
  { productId: 2, minQuantity: 2, discountPercentage: 0, freeProducts: 1, discountPrice: 0 }
];


@Component({
  selector: 'app-checkout_page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  /**List of Products Parameters*/
  products: Product[] = PRODUCT_DATA;
  checkoutProducts: Product[] = [];
  discounts: Discount[] = DISCOUNT_DATA;
  quantity: number[] = [];
  displayProductList: boolean = true;
  disableCheckout: boolean = false;

  /**Display Summary Table Parameters */
  dataSource = new MatTableDataSource<Product>(PRODUCT_DATA);
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice', 'discountedPrice', 'totalPriceAfterDiscount'];
  displayCheckoutSummary: boolean = false;
  isItemPresent: boolean = false;
  disablePay: boolean = false;

  /**Payment Summary Parameters */
  displayPaymentSummary: boolean = false;
  totalProductPrice: number = 0;
  discountedPrice: number = 0;
  finalPricePaid: number = 0;

  ngOnInit(): void {
    this.sortProducts();
  }

  sortProducts() {
    /**sort the products with their names*/
    this.products.sort((a, b) => a.productName.localeCompare(b.productName));
  }

  saveQuantity(id: number, price: number, index: number) {
    let quantityCheck = 0;
    this.quantity.forEach((quantity) => {
      if(quantity < 0 || quantity > 10){
        quantityCheck++;
      }
    })
    if(quantityCheck>0){
      this.disableCheckout = true;
    }
    else{
      this.disableCheckout = false;
      if (this.quantity[index] === null || this.quantity[index] === undefined || this.quantity[index] === 0) {
        this.products[index].quantity = 0;
      }
      else{
        this.products[index].quantity = this.quantity[index];
      }
      this.products[index].totalPrice = this.quantity[index] * price;
      this.products[index].afterDiscntTotalPrice = this.products[index].totalPrice;
    }
  }

  checkout() {
    this.checkoutProducts = this.products.filter((product) => product.quantity > 0);
    this.checkoutProducts.forEach((product) => {
      this.discounts.forEach((discount) => {
        if (product.productId === discount.productId) {
          /* Discount percentage on Product */
          if (discount.discountPercentage != 0 && discount.discountPrice === 0 && discount.freeProducts === 0) {
            if (product.quantity >= discount.minQuantity) {
              if (discount.discountPercentage > 0 && discount.discountPercentage < 100) {
                product.discountedPrice = (discount.discountPercentage / 100) * product.productPrice;
                product.afterDiscntTotalPrice = product.totalPrice - product.discountedPrice;
              }
            }
          }
          /** Discount Price Per Product */
          else if (discount.discountPercentage === 0 && discount.discountPrice != 0 && discount.freeProducts === 0) {
            if (product.quantity >= discount.minQuantity) {
              product.afterDiscntTotalPrice = product.quantity * discount.discountPrice;
              product.discountedPrice = product.totalPrice - product.afterDiscntTotalPrice;
            }
            else {
              product.discountedPrice = 0;
            }
          }
          /**Discount on number of products */
          else if (discount.discountPercentage === 0 && discount.discountPrice === 0 && discount.freeProducts != 0) {
            if (product.quantity >= discount.minQuantity) {
              let freeItems = Math.floor(product.quantity / discount.minQuantity);
              product.quantity = product.quantity + freeItems * discount.freeProducts;
              product.afterDiscntTotalPrice = product.totalPrice;
              product.totalPrice = product.quantity * product.productPrice;
              product.discountedPrice = product.totalPrice - product.afterDiscntTotalPrice;
            }
          }
          /**Any other case not valid */
          else {
            product.discountedPrice = 0;
            product.afterDiscntTotalPrice = product.totalPrice+product.discountedPrice;
          }
        }
      })
    })
    this.dataSource.data = this.checkoutProducts;
    this.displayProductList = false;
    this.displayCheckoutSummary = true;
    this.displayPaymentSummary = false;
    if (this.dataSource.data.length > 0) {
      this.isItemPresent = true;
      this.disablePay = false;
    }
    else {
      this.isItemPresent = false;
      this.disablePay = true;
    }
  }

  reset(){
    window.location.reload();
  }

  pay(){
    this.displayProductList = false;
    this.displayCheckoutSummary = false;
    this.displayPaymentSummary = true;
  }
  back(){
    let length = this.products.length;
    for(let i=0;i<length;i++){
      this.products[i].quantity = this.quantity[i];
    }
    this.displayProductList = true;
    this.displayCheckoutSummary = false;
    this.displayPaymentSummary = false;
  }
  getTotalCost() {
    this.totalProductPrice =  this.dataSource.data.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
    return this.totalProductPrice;
  }

  getDiscountCost() {
    this.discountedPrice = this.dataSource.data.map(t => t.discountedPrice).reduce((acc, value) => acc + value, 0);
    return this.discountedPrice;
  }

  getTotalCostAfterDiscount() {
    this.finalPricePaid = this.dataSource.data.map(t => t.afterDiscntTotalPrice).reduce((acc, value) => acc + value, 0);
    return this.finalPricePaid;
  }
}
