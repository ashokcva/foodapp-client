import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HotelListService {

  url = 'http://localhost:3000/posts';
  

  constructor(private http:HttpClient) { }


  hotels(sortCondition:string='',nameFilter:string='',cuisines:string[]=[])
  {

    const queryParams = new HttpParams({
      fromObject: {
        "sortoption":sortCondition,
        "resname":nameFilter,
        "cuisine":cuisines
      }
    });

    // let queryParams = new HttpParams().append("sortoption",sortCondition);
    // queryParams = new HttpParams().append("resname",nameFilter);
    return this.http.get(this.url,{params:queryParams});
  }
}
