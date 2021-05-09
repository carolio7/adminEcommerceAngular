import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {


  @Input() products: Product[]=[] ;
  productModalOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(product: Product):void {
    this.productModalOpen = true;
  }

  onDelete(product: Product):void {

  }

  addProduct():void{
    this.productModalOpen = true;
  }

}
