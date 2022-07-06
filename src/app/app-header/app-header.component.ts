import { Component,ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { debounceTime, distinctUntilChanged,  } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HotelListService } from '../services/hotel-list.service';

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
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    public userQuestion: string = '';
    userQuestionUpdate = new Subject<string>();  
    separatorKeysCodes: number[] = [ENTER, COMMA];
    cuisineCtrl = new FormControl('');
    filteredCuisine: Observable<string[]>;
    cuisines: string[] = ['South Indian'];
    allCuisine: string[] = ['Sandwich', 
    'Street Food', 'Fast Food', 'Desserts',
    'Beverages', 'South Indian','North Indian',
    'Chinese','Shake','Mughlai','Lebanese','Chettinad'
  ];
  hotels:any;
  nameFilter:any;
  sortCondition:any;

  constructor(private breakpointObserver: BreakpointObserver, private hotelService:HotelListService) {
      hotelService.hotels().subscribe((data)=>{
      this.hotels=data
      console.log(this.hotels)
      })

    this.filteredCuisine = this.cuisineCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCuisine.slice())),
    );
    
    this.userQuestionUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.nameFilter = value;
        this.onSortingChange();
        console.log(value);
      });
  }

  onSortingChange(){

    this.hotelService.hotels(this.sortCondition,this.nameFilter).subscribe((data)=>{
      this.hotels=data
      console.log(this.hotels)
      })

    console.log(this.sortCondition);
  }

  value = '';

  ratings: Rating[] = [
    {value: '5', viewValue: '5'},
    {value: '4', viewValue: '4+'},
    {value: '3', viewValue: '3+'},
  ];

add(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  // Add our fruit
  if (value) {
    this.cuisines.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();

  this.cuisineCtrl.setValue(null);
}

remove(fruit: string): void {
  const index = this.cuisines.indexOf(fruit);

  if (index >= 0) {
    this.cuisines.splice(index, 1);
  }
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.cuisines.push(event.option.viewValue);
  this.cuisineCtrl.setValue(null);
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.allCuisine.filter(fruit => fruit.toLowerCase().includes(filterValue));
}
}
