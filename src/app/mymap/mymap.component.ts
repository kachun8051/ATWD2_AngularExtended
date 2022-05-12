import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-mymap',
  templateUrl: './mymap.component.html',
  styleUrls: ['./mymap.component.css']
})
// reference: https://github.com/angular/components/blob/main/src/google-maps/map-marker/README.md
// reference: https://github.com/angular/components/tree/main/src/google-maps#readme
export class MymapComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  @Input()
  center: google.maps.LatLngLiteral;
  @Input()
  markerPositions: google.maps.LatLngLiteral[];
  @Input()
  title: string;  
  @Input()
  zoom = 14;

  markerOptions: google.maps.MarkerOptions 
  //markerPositions: google.maps.LatLngLiteral[];

  constructor(httpClient: HttpClient) {
    
    this.title = '';
    this.center = {lat: 0, lng: 0};
    this.markerOptions = {draggable: false};
    this.markerPositions = [{lat: 0, lng: 0}];
    const YOUR_KEY_HERE = 'AIzaSyCiG-x1WBMiY3h_2_VX8yLkW_YvV0Mfj_A';
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + YOUR_KEY_HERE, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
   }

  ngOnInit(): void {
    
  }

}
