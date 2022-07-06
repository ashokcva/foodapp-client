import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HotelListService } from '../services/hotel-list.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {  Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { debounceTime, distinctUntilChanged,  } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Rating {
  value: string;
  viewValue: string;
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-maincontent',
  templateUrl: './maincontent.component.html',
  styleUrls: ['./maincontent.component.scss']
})
export class MaincontentComponent implements OnInit {

  title = 'foodorderapp';
  public consoleMessages: string[] = [];
  public userQuestion: string = '';
  userQuestionUpdate = new Subject<string>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  hotels:any;
  sortCondition:any;
  nameFilter:any;
  cuisineCtrl = new FormControl('');
  filteredCuisine: Observable<string[]>;
  cuisines: string[] = [];
  allCuisine: string[] = ['Sandwich', 
  'Street Food', 'Fast Food', 'Desserts',
  'Beverages', 'South Indian','North Indian',
  'Chinese','Shake','Mughlai','Lebanese','Chettinad'
];

value = '';
  constructor(private hotelService:HotelListService) { 
    hotelService.hotels().subscribe((data)=>{
      this.hotels=data
      console.log(this.hotels)
      })

      this.filteredCuisine = this.cuisineCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCuisine.slice())),
        
      );

      this.filteredCuisine.subscribe(
        (value)=>{
          console.log(value);
          this.fetchHotels();
        }
      );

      this.userQuestionUpdate.pipe(
        debounceTime(400),
        distinctUntilChanged())
        .subscribe(value => {
          this.nameFilter = value;
          this.fetchHotels();
          // this.consoleMessages.push(value);
          console.log(value);
        });
  }

  ngOnInit(): void {
    
  }

  fetchHotels(){

    this.hotelService.hotels(this.sortCondition,this.nameFilter,this.cuisines).subscribe((data)=>{
      this.hotels=data
      console.log(this.hotels)
      })

    console.log(this.sortCondition);
  }

  
add(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  // Add our fruit
  if (value) {
    this.cuisines.push(value);
    // this.fetchHotels();  
    console.log(this.cuisines)
  }

  // Clear the input value
  event.chipInput!.clear();

  this.cuisineCtrl.setValue(null);
}

remove(fruit: string): void {
  const index = this.cuisines.indexOf(fruit);

  if (index >= 0) {
    this.cuisines.splice(index, 1);
    // this.fetchHotels();  
    console.log(this.cuisines)
  }
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.cuisines.push(event.option.viewValue);
  // this.fruitInput.nativeElement.value = '';
  this.cuisineCtrl.setValue(null);
  // this.fetchHotels();  
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  // this.fetchHotels();  
  return this.allCuisine.filter(fruit => fruit.toLowerCase().includes(filterValue));
}




states = new Map([[3, 'Rating: High to low'],[2, 'Price: Low to High'], [1, 'Price: High to low']]);

  
}
