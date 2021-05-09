import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Response } from '../models/response'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = `${environment.api+'products'+'?API_KEY='+environment.api_key}`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl);
  }
}
