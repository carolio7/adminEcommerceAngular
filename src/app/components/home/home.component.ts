import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Response } from '../../models/response'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: any;
  productSub: any;

  constructor(private productServices: ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productServices.getProducts().subscribe(
      (response: Response) => {
        this.products = response.result;
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
