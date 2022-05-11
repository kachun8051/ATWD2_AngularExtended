import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mymapmodal',
  templateUrl: './mymapmodal.component.html',
  styleUrls: ['./mymapmodal.component.css']
})
export class MymapmodalComponent implements OnInit {

  @Input()
  isVisible: boolean = false;
  @Output()
  isVisibleChange = new EventEmitter<any>();
 
  title: string = "Google Map";

  @Input()
  latitude: number

  @Input()
  longitude: number

  @Input()
  latitude2: string // latitude2 is for display

  @Input()
  longitude2: string // longitude is for display

  @Input()
  center: any;

  constructor() { 
    this.latitude = 0;
    this.longitude = 0;    
    this.center = { lat: 0, lng: 0 };
    this.latitude2 = '';
    this.longitude2 = '';
  }

  ngOnInit(): void {
  }

  handleOk(): void {
    console.log('handleOk is called');
    this.isVisibleChange.emit(false);
  }

  handleCancel(): void {
    console.log('handleCancel is called');
    this.isVisibleChange.emit(false);
  }

}
