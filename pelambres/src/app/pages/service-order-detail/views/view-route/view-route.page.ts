import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { IonSlides } from '@ionic/angular';
import * as moment from 'moment';
import { darkStyle } from 'src/app/maps/darkStyle';
import { grayDarkStyle } from 'src/app/maps/grayDarkStyle';
import { grayStyle } from 'src/app/maps/grayStyle';
import { lightStyle } from 'src/app/maps/lightStyle';
import { Utils } from 'src/app/utils/utils';

declare var google;

@Component({
  selector: 'app-view-route',
  templateUrl: './view-route.page.html',
  styleUrls: ['./view-route.page.scss'],
})
export class ViewRoutePage implements OnInit {
  @Input() item: any;
  @Input() slider: IonSlides;
  
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  map: any;

  lat = 41.85;
  lng = -87.65;

  origin = { lat: 29.8174782, lng: -95.6814757 };
  destination = { lat: 40.6976637, lng: -74.119764 };
  waypoints = [
    //  {location: { lat: 39.0921167, lng: -94.8559005 }},
    //  {location: { lat: 41.8339037, lng: -87.8720468 }}
  ];
  approximate_time: any;
  approximate_distance: any;

  constructor(public util: Utils) { }

  ngOnInit() {
    moment.locale('es');
  }

  
  ngAfterViewInit(): void {
    let styles = [];
    styles = this.util.isDay() ? lightStyle : darkStyle;
    const map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      styles: styles,
      center: {lat: this.lat, lng: this.lng},
      mapTypeControl: true,
      mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DEFAULT,
          mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.TERRAIN]
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
      },
      scaleControl: true,
      streetViewControl: true
    });

    this.directionsDisplay.setMap(map);
    // this.calculateAndDisplayRoute();
    this.getRoute();
    console.log('service',this.item);
  }

  onClickMap(event){
    if(event=='mousedown'){
      this.slider.lockSwipes(true);
    }else  if(event=='mouseup'){
      this.slider.lockSwipes(false);
    }
  }

  getRoute(){
    if(this.item.origin){
      this.waypoints.push({location: { lat: Number(this.item.origin.latitude), lng: Number(this.item.origin.longitude) }});
    }
    if(this.item.destination){
      this.waypoints.push({location: { lat: Number(this.item.destination.latitude), lng: Number(this.item.destination.longitude) }});
    }
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    const that = this;
    console.log('this.waypoints', this.waypoints);
    if(this.waypoints.length > 0){
      this.directionsService.route({
        origin: this.waypoints[0],
        destination: this.waypoints[this.waypoints.length-1],
        waypoints: this.waypoints,
        travelMode: 'DRIVING'
      }, (response, status) => {
        console.log('response', response);
        if (status === 'OK') {
          this.computeTotalDistance(response);
          that.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  }

  computeTotalDistance(result) {
    let totalDistance = 0;
    let totalDuration = 0;
    const myroute = result.routes[0];
  
    for (let i = 0; i < myroute.legs.length; i++) {
      totalDistance += myroute.legs[i].distance.value;
      totalDuration += myroute.legs[i].duration.value;
    }
    totalDistance = totalDistance / 1000;
    totalDuration = totalDuration / 60;
    let hour  = '0';

    hour = moment().startOf('day').add(totalDuration, 'minute').format('H')
    let minute = moment().startOf('day').add(totalDuration, 'minute').format('m')
    console.log('TOTAL', totalDistance);
    console.log('DURATION', totalDuration);
    console.log('HOUR ', hour);
    console.log('MINUTE ', minute);
    this.approximate_distance = (Math.round(totalDistance * 100) / 100).toFixed(1) + ' km';
    this.approximate_time = hour + ' h ' + minute + ' m';
    // document.getElementById("total").innerHTML = total + " km";
  }

}
