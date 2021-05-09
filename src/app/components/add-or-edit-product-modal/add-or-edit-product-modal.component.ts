import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit, OnDestroy {

  @Input() product: Product | undefined
  productForm: FormGroup;
  categories: Category[] | undefined;
  categorySub: Subscription | undefined;
  idCategory = 1;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) {
    this.productForm = fb.group({
      productInfos: fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required]
      }),
      illustration: fb.group({
        image: ['', Validators.required]
      })
    })
  }

  selectCategory(id: number){
    this.idCategory = id;
  }



  ngOnInit(): void {
    this.categorySub = this.categoriesService.getCategory().subscribe(
      (response) => {
        this.categories = response.result;
        //console.log(this.categories);

      }
    )
  }

  ngOnDestroy(): void{
    this.categorySub?.unsubscribe();
  }

}
