import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { darkStyle } from 'src/app/maps/darkStyle';
import { grayDarkStyle } from 'src/app/maps/grayDarkStyle';
import { grayStyle } from 'src/app/maps/grayStyle';
import { lightStyle } from 'src/app/maps/lightStyle';
import { Location, PointObject, _LatLng } from 'src/app/models/models';
import { Utils } from 'src/app/utils/utils';
// import {
//   GoogleMaps,
//   GoogleMap,
//   GoogleMapsEvent,
//   ILatLng,
//   Marker,
//   BaseArrayClass
// } from '@ionic-native/google-maps';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

declare var google;

@Component({
  selector: 'go-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() form: any;
  @Input() many: boolean;
  @Input() maxHeight = false;
  @Input() clearMap: boolean = false;
  @Input() type: any;
  @Input() text: any = 'Item';
  @Input() value: any;
  @Input() defaultData: any;
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() markers: PointObject[] = [];
  @Input() modal: ModalController;


  @Output() selectEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateEvent: EventEmitter<any> = new EventEmitter<number>();
  count: number = 0;

  @Input() item: any;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  map: any;
  marker: any;

  lat = -24.25614404275534;
  lng = -69.1307066307567;

  origin = { lat: 29.8174782, lng: -95.6814757 };
  destination = { lat: 40.6976637, lng: -74.119764 };
  waypoints = [
    //  {location: { lat: 39.0921167, lng: -94.8559005 }},
    //  {location: { lat: 41.8339037, lng: -87.8720468 }}
  ];
  approximate_time: any;
  approximate_distance: any;

  _zoom = 8;
  infowindow = new google.maps.InfoWindow();

  constructor(public util: Utils) {



    // setTimeout(()=> {
    //   try{
    //     this.lat = navParams.get('latitude');
    //     this.lng = navParams.get('longitude');
    //     console.log('NavParams', this.lat, this.lng);
    //     this.setMarkerPosition(this.lat, this.lng);

    //   }catch(ex){
    //     console.log('nav', ex)
    //   }
    //   }, 1000);
    // if(this.latitude && this.longitude){
    //   this.initMap();
    //   // this.setMarkerPosition(this.latitude, this.longitude);
    //   // this.lat = this.latitude;
    //   // this.lng = this.longitude;
    // }
    // setMarkerPosition

  }

  ngOnInit() {
    moment.locale('es');
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      }
    }, 1000);
  }

  ngAfterViewInit(): void {
    
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGES', changes);

    // console.log('CHANGES', this.latitude, this.longitude);
    if (this.latitude && this.longitude) {

      setTimeout(() => {
        this.lat = Number(this.latitude);
        this.lng = Number(this.longitude);
        this.setMarkerPosition(this.lat, this.lng)
      }, 1000);

    }

    if (changes['markers']) {
      console.log('this.markers', this.markers);
      if (this.markers?.length > 0) {
        setTimeout(() => {
          for (let point of this.markers) {
            console.log('this.markers points', point.info, Number(point.latitude), Number(point.longitude))
            this.setMarkerPosition(Number(point.latitude), Number(point.longitude), false, point.icon, point.info, point.num)
          }
        }, 500)
      }
    }

    // if(changes){


    //   if(this.clearMap === true){
    //     console.log('clear marker');
    //     this.marker.setMap(null);
    //     this.latitude = null;
    //     this.longitude = null;
    //     this.clearMap = false;
    //     this.initMaker();
    //   }

    // }
  }

  initMap() {
    console.log('init Map')
    let styles = [];
    styles = this.util.isDay() ? lightStyle : darkStyle;

    // this.map = GoogleMaps.create('map', {
    //   // camera: {
    //   //   target: bounds
    //   // }
    // }); 

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this._zoom,
      styles: styles,
      center: {lat: this.lat, lng: this.lng},
      gestureHandling: "cooperative",
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
          google.maps.MapTypeId.TERRAIN]
      },
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      scaleControl: true,
      streetViewControl: true
    });

    this.initMaker();


    this.directionsDisplay.setMap(this.map);
  }

  initMaker() {
    // this.marker = new google.maps.Marker({
    //   map: this.map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP
    // });
  }

  public clearMarker() {
    // console.log('clear marker');
    // console.log('clear marker');
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.latitude = null;
    this.longitude = null;
    this.clearMap = false;
    this.initMaker();
  }

  /**
  * Re-position marker and set input values.
  */

  zoomPosition(markers = []) {
    //   var markers = [];//some array
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      // console.log('bounds', markers[i]);
      bounds.extend(markers[i]);
    }
    this.map.fitBounds(bounds);
  }

  zoom() {
    var bounds = new google.maps.LatLngBounds();
    this.map.data.forEach(function (feature) {
      this.processPoints(feature.getGeometry(), bounds.extend, bounds);
    });
    // console.log('bounds', bounds);
    this.map.fitBounds(bounds);
  }

  processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function (g) {
        this.processPoints(g, callback, thisArg);
      });
    }
  }

  toggleBounce() {
    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  setMarkerPosition(lat: number, lon: number, clear=true, icon=null, info=null, num=null): any {
    console.log('position', lat, lon, this.clearMap);

    if (clear) {
      if (this.marker) {
        this.marker.setMap(null);
      }
    }

    if (this.map == null) {
      this.initMap();
    }

    if(!icon){
      icon = 'blue';
    }

    let svg = '';

    let iconSvg = '<svg width="73" height="112" viewBox="0 0 73 112" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<path d="M36.4995 7C16.3423 7 0 23.3418 0 43.5005C0 50.712 2.09461 57.3957 5.70347 63.0533C5.87763 63.3297 6.01112 63.6008 6.19257 63.872L28.8396 105.91C29.9033 108.966 32.9172 111.286 36.3378 111.286C39.7585 111.286 42.6055 108.966 43.6692 105.91L68.9276 60.2845C71.5295 55.2631 73 49.5429 73 43.5005C73 23.3418 56.6582 7 36.4995 7Z" fill="#9E9E9E"/>'
    +'<path d="M36.4995 7C16.3423 7 0 23.1645 0 43.5005C0 50.2792 2.09461 57.0576 5.70347 62.7934C5.87763 63.3148 6.01112 63.3152 6.19257 63.8367L28.8396 105.552C29.9033 108.68 32.9172 111.287 36.3378 111.287C39.7585 111.287 42.6055 108.68 43.6692 105.552L68.9276 60.1862C71.5295 54.9719 73 49.2363 73 43.5005C73 23.1645 56.6582 7 36.4995 7Z" fill="#FFFFFF" fill-opacity="0.25"/>'
    +'<path d="M36.4995 0C16.3423 0 0 16.3418 0 36.5005C0 43.712 2.09461 50.3957 5.70347 56.0533C5.87763 56.3297 6.01112 56.6008 6.19257 56.872L28.8396 98.9102C29.9033 101.966 32.9172 104.286 36.3378 104.286C39.7585 104.286 42.6055 101.966 43.6692 98.9102L68.9276 53.2845C71.5295 48.2631 73 42.5429 73 36.5005C73 16.3418 56.6582 0 36.4995 0Z" fill="#9E9E9E"/>'
    +'<path d="M58.3215 33.1514C58.0851 32.8136 57.6966 32.6109 57.2913 32.6109H49.4375V29.2667C49.4375 28.5743 48.8632 28 48.1707 28H19.7113C19.0188 28 18.4446 28.5743 18.4446 29.2667V49.7373C18.4446 50.4297 19.0188 51.004 19.7113 51.004H23.292C23.9507 53.301 26.0788 55.0069 28.5785 55.0069C31.0782 55.0069 33.2063 53.3179 33.865 51.004H47.9005C48.5592 53.301 50.6873 55.0069 53.187 55.0069C55.6867 55.0069 57.8148 53.3179 58.4735 51.004H61.0915C61.784 51.004 62.3582 50.4297 62.3582 49.7373V39.3162C62.3582 39.046 62.2738 38.7926 62.1217 38.5899L58.3215 33.1514ZM59.8416 39.6878H54.1666V35.1613H56.6494L59.8416 39.6878ZM20.9781 30.5504H46.904V48.4874H33.9833C33.4934 45.937 31.264 44.0116 28.5785 44.0116C25.893 44.0116 23.6467 45.937 23.1737 48.4874H20.9781V30.5504ZM28.5785 52.4734C26.9402 52.4734 25.6059 51.1391 25.6059 49.5008C25.6059 47.8625 26.9402 46.5282 28.5785 46.5282C30.2168 46.5282 31.5511 47.8625 31.5511 49.5008C31.5511 51.1391 30.2168 52.4734 28.5785 52.4734ZM53.2039 52.4734C51.5656 52.4734 50.2313 51.1391 50.2313 49.5008C50.2313 47.8625 51.5656 46.5282 53.2039 46.5282C54.8422 46.5282 56.1765 47.8625 56.1765 49.5008C56.1765 51.1391 54.8422 52.4734 53.2039 52.4734ZM58.6087 48.4874C58.1189 45.937 55.8894 44.0116 53.2039 44.0116C51.7514 44.0116 50.4171 44.5858 49.4375 45.5148V35.1613H51.6163V40.9545C51.6163 41.647 52.1905 42.2213 52.883 42.2213H59.8585V48.4874H58.6087Z" fill="white"/>'
    +'<path d="M6.26674 30.552H15.3028C15.9953 30.552 16.5696 29.9778 16.5696 29.2853C16.5696 28.5928 15.9953 28.0186 15.3028 28.0186H6.26674C5.57426 28.0186 5 28.5928 5 29.2853C5 29.9778 5.57426 30.552 6.26674 30.552Z" fill="white"/>'
    +'<path d="M15.303 32.6276H8.34437C7.65189 32.6276 7.07764 33.2018 7.07764 33.8943C7.07764 34.5868 7.65189 35.161 8.34437 35.161H15.303C15.9955 35.161 16.5697 34.5868 16.5697 33.8943C16.5697 33.2018 16.0124 32.6276 15.303 32.6276Z" fill="white"/>'
    +'<path d="M15.3022 37.2385H10.9108C10.2183 37.2385 9.64404 37.8128 9.64404 38.5053C9.64404 39.1977 10.2183 39.772 10.9108 39.772H15.3022C15.9947 39.772 16.5689 39.1977 16.5689 38.5053C16.5689 37.8128 16.0115 37.2385 15.3022 37.2385Z" fill="white"/>'
    +'<path d="M15.3029 41.85H13.7829C13.0904 41.85 12.5161 42.4242 12.5161 43.1167C12.5161 43.8092 13.0904 44.3835 13.7829 44.3835H15.3029C15.9954 44.3835 16.5697 43.8092 16.5697 43.1167C16.5697 42.4242 16.0123 41.85 15.3029 41.85Z" fill="white"/>'
    +'</svg>';

    if(num){
      iconSvg = '<svg width="73" height="112" viewBox="0 0 73 112" fill="none" xmlns="http://www.w3.org/2000/svg">'
      +'<path d="M36.4995 7C16.3423 7 0 23.3418 0 43.5005C0 50.712 2.09461 57.3957 5.70347 63.0533C5.87763 63.3297 6.01112 63.6008 6.19257 63.872L28.8396 105.91C29.9033 108.966 32.9172 111.286 36.3378 111.286C39.7585 111.286 42.6055 108.966 43.6692 105.91L68.9276 60.2845C71.5295 55.2631 73 49.5429 73 43.5005C73 23.3418 56.6582 7 36.4995 7Z" fill="#9E9E9E"/>'
      +'<path d="M36.4995 7C16.3423 7 0 23.1645 0 43.5005C0 50.2792 2.09461 57.0576 5.70347 62.7934C5.87763 63.3148 6.01112 63.3152 6.19257 63.8367L28.8396 105.552C29.9033 108.68 32.9172 111.287 36.3378 111.287C39.7585 111.287 42.6055 108.68 43.6692 105.552L68.9276 60.1862C71.5295 54.9719 73 49.2363 73 43.5005C73 23.1645 56.6582 7 36.4995 7Z" fill="#FFFFFF" fill-opacity="0.30"/>'
      +'<path d="M36.4995 0C16.3423 0 0 16.3418 0 36.5005C0 43.712 2.09461 50.3957 5.70347 56.0533C5.87763 56.3297 6.01112 56.6008 6.19257 56.872L28.8396 98.9102C29.9033 101.966 32.9172 104.286 36.3378 104.286C39.7585 104.286 42.6055 101.966 43.6692 98.9102L68.9276 53.2845C71.5295 48.2631 73 42.5429 73 36.5005C73 16.3418 56.6582 0 36.4995 0Z" fill="#9E9E9E"/>'
      +'<path d="M58.3215 43.1514C58.0851 42.8136 57.6966 42.6109 57.2913 42.6109H49.4375V39.2667C49.4375 38.5743 48.8632 38 48.1707 38H19.7113C19.0188 38 18.4446 38.5743 18.4446 39.2667V59.7373C18.4446 60.4297 19.0188 61.004 19.7113 61.004H23.292C23.9507 63.301 26.0788 65.0069 28.5785 65.0069C31.0782 65.0069 33.2063 63.3179 33.865 61.004H47.9005C48.5592 63.301 50.6873 65.0069 53.187 65.0069C55.6867 65.0069 57.8148 63.3179 58.4735 61.004H61.0915C61.784 61.004 62.3582 60.4297 62.3582 59.7373V49.3162C62.3582 49.046 62.2738 48.7926 62.1217 48.5899L58.3215 43.1514ZM59.8416 49.6878H54.1666V45.1613H56.6494L59.8416 49.6878ZM20.9781 40.5504H46.904V58.4874H33.9833C33.4934 55.937 31.264 54.0116 28.5785 54.0116C25.893 54.0116 23.6467 55.937 23.1737 58.4874H20.9781V40.5504ZM28.5785 62.4734C26.9402 62.4734 25.6059 61.1391 25.6059 59.5008C25.6059 57.8625 26.9402 56.5282 28.5785 56.5282C30.2168 56.5282 31.5511 57.8625 31.5511 59.5008C31.5511 61.1391 30.2168 62.4734 28.5785 62.4734ZM53.2039 62.4734C51.5656 62.4734 50.2313 61.1391 50.2313 59.5008C50.2313 57.8625 51.5656 56.5282 53.2039 56.5282C54.8422 56.5282 56.1765 57.8625 56.1765 59.5008C56.1765 61.1391 54.8422 62.4734 53.2039 62.4734ZM58.6087 58.4874C58.1189 55.937 55.8894 54.0116 53.2039 54.0116C51.7514 54.0116 50.4171 54.5858 49.4375 55.5148V45.1613H51.6163V50.9545C51.6163 51.647 52.1905 52.2213 52.883 52.2213H59.8585V58.4874H58.6087Z" fill="white"/>'
      +'<path d="M6.26674 40.552H15.3028C15.9953 40.552 16.5696 39.9778 16.5696 39.2853C16.5696 38.5928 15.9953 38.0186 15.3028 38.0186H6.26674C5.57426 38.0186 5 38.5928 5 39.2853C5 39.9778 5.57426 40.552 6.26674 40.552Z" fill="white"/>'
      +'<path d="M15.303 42.6276H8.34437C7.65189 42.6276 7.07764 43.2018 7.07764 43.8943C7.07764 44.5868 7.65189 45.161 8.34437 45.161H15.303C15.9955 45.161 16.5697 44.5868 16.5697 43.8943C16.5697 43.2018 16.0124 42.6276 15.303 42.6276Z" fill="white"/>'
      +'<path d="M15.3022 47.2385H10.9108C10.2183 47.2385 9.64404 47.8128 9.64404 48.5053C9.64404 49.1977 10.2183 49.772 10.9108 49.772H15.3022C15.9947 49.772 16.5689 49.1977 16.5689 48.5053C16.5689 47.8128 16.0115 47.2385 15.3022 47.2385Z" fill="white"/>'
      +'<path d="M15.3029 51.85H13.7829C13.0904 51.85 12.5161 52.4242 12.5161 53.1167C12.5161 53.8092 13.0904 54.3835 13.7829 54.3835H15.3029C15.9954 54.3835 16.5697 53.8092 16.5697 53.1167C16.5697 52.4242 16.0123 51.85 15.3029 51.85Z" fill="white"/>'
      +'<rect x="7" y="12" width="59" height="19" rx="9" fill="#424141" fill-opacity="0.5" />'
      +'<text x="50%" y="24"  dominant-baseline="middle" text-anchor="middle" font-family="Arial" id="target3" font-size="1.2em" fill="white">x000x</text>'
      +'</svg>'
      iconSvg = iconSvg.split('x000x').join(num);
    }
    

    svg = iconSvg.split('#9E9E9E').join(icon);
    console.log('svg', icon);
    console.log('info', info);
    
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: {
        // url: 'assets/map/marker_default.svg',
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        size: new google.maps.Size(36, 53),
        scaledSize: new google.maps.Size(36, 53),
        optimized: false
        // anchor: new google.maps.Point(0, 80)
      },
      position: {
        lat: Number(lat),
        lng: Number(lon)
      },
      title: "Servicio 100",
    });

    if(info){
      let infowindow = new google.maps.InfoWindow({
       content: info,
     });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: this.map,
          shouldFocus: false,
        });
      });
    }
    

    // this.map.addMarker({
    //   map: this.map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP,
    //   position: {
    //     lat: Number(lat),
    //     lng: Number(lon)
    //   },
    // }).then((marker: Marker) => {

    // });
    console.log('map', this.map)
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.getPosition());

    // //center the map to the geometric center of all markers
    try {
      this.map.setCenter(bounds.getCenter());
      //remove one zoom level to ensure no marker is on the edge.
      this.map.setZoom(this._zoom + 3);

      // // set a minimum zoom 
      // // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
      if (this.map.getZoom() > 15) {
        this.map.setZoom(15);
      }
    } catch (ex) {

    }


    // this.map.fitBounds(bounds);


  }

  onClickMap(event) {
    console.log('ma event');
    if (this.marker) {
      this.latitude = this.marker.getPosition().lat();
      this.longitude = this.marker.getPosition().lng();
      let position: _LatLng = new _LatLng();
      position.latitude = this.marker.getPosition().lat();
      position.longitude = this.marker.getPosition().lng();
      this.updateEvent.emit(position);
    }

    
    
  }

  addPoint(location: Location) {
    if (location) {
      this.waypoints.push({ location: { lat: Number(location.latitude), lng: Number(location.longitude) } });
    }
    // this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    const that = this;
    console.log('this.waypoints', this.waypoints);
    if (this.waypoints.length > 0) {
      this.directionsService.route({
        origin: this.waypoints[0],
        destination: this.waypoints[this.waypoints.length - 1],
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
    let hour = '0';

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

  dismiss(status: boolean = false) {
    this.modal.dismiss({
      'dismissed': true,
      'changes': status,
    });
  }

}
