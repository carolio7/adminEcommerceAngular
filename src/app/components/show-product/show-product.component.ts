import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/models/response';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {


  @Input() products: Product[];
  productModalOpen = false;
  selectedProduct: Product | undefined;
  delete = false;
  productToBeDelete: Product;
  file: File;
  progress = 0;
  baseUrlImage = `${environment.api_image}`;

  constructor(private productService: ProductsService, private fileService: FileUploadService ) { }

  ngOnInit(): void {
  }

  onEdit(product: Product):void {
    this.productModalOpen = true;
    this.selectedProduct = product;
  }

  onDelete(product: Product):void {
    this.delete = true;
    this.productToBeDelete = product;
  }

  addProduct():void{
    this.selectedProduct = undefined;
    this.productModalOpen = true;
  }

  handleCancelDelete(){
    this.delete = false;
  }

  handleConfirmDelete(){
    this.productService.deleteProduct(this.productToBeDelete).subscribe(
      (data: Response) => {
        if (data.status == 200){
          // Delete Product image
          this.fileService.deleteImage(this.productToBeDelete.image).subscribe(
            (data: Response) => {
              console.log(data);

            }
          );
          console.log(data);

          // Update Frontend
          const index = this.products.findIndex( p => p.idProduct == this.productToBeDelete.idProduct);
          this.products.splice(index, 1);

        } else{
          console.log(data.message);

        }
      }
    )
    this.handleCancelDelete();
  }

  handleFinish(event: any){
    let product = event.product ? event.product : null;
    this.file = event.file ? event.file: null;

    if (event.product){
      console.log(event.product);

      if (this.selectedProduct){
        // Edit product
        product.idProduct = this.selectedProduct.idProduct;
        this.editProductToServer(product);

      } else{
        //Add product
        this.addProductToServer(product);
      }
    }

    this.productModalOpen = false;
  }

  uploadImage(event: any){
    return new Promise(
      (resolve, reject) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log("Requete envoyée avec succès");

            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            if (this.progress == 100){
              resolve(true);
            }
            break;
          case HttpEventType.Response:
            console.log(event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);

        }
      }
    )
  }


  addProductToServer(product:Product){
    this.productService.addProduct(product).subscribe(
      (data: Response) => {
        if (data.status == 200){
          // Update frontend
          if (this.file){
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                    product.idProduct = data.args.lastInsertId;
                    product.Category = product.Category;
                    this.products.push(product);
                  }
                );
              }
            )
          }

        }

      }
    )
  }


  editProductToServer(product:Product){
    this.productService.editProduct(product).subscribe(
      (data: Response) =>{
        if (data.status == 200){
          if (this.file){
            this.fileService.uploadImage(this.file).subscribe(
              (event: HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                    // update frontend
                    this.updateProducts(product);
                  }
                );
              }
            );
            this.fileService.deleteImage(product.oldImage).subscribe(
              (data) => {
                console.log(data);

              }
            )
          } else{
            this.updateProducts(product)
          }


        } else {
          console.log(data.message);

        }
      }
    )

  }


  updateProducts(product: Product){
     // update frontend
     const index = this.products.findIndex(p => p.idProduct == product.idProduct);
     product.Category = product.Category;
     this.products = [
       ...this.products.slice(0, index),
       product,
       ...this.products.slice(index+1)
     ]
  }

}
