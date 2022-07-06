import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userQuestion:any;

  constructor(){
  
  }
}