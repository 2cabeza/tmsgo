/**
 * Create a map with a marker.
 * Creating or dragging the marker sets the latitude and longitude values
 * in the input fields.
 */
;(function() {
  var $ = django.jQuery;
  // We'll insert the map after this element:
  var prev_el_selector = '.form-row.field-longitude';

  // The input elements we'll put lat/lon into and use
  // to set the map's initial lat/lon.
  var lat_input_selector = '#id_latitude',
      lon_input_selector = '#id_longitude',
      address_input_selector = '#id_address';

  // If we don't have a lat/lon in the input fields,
  // this is where the map will be centered initially.
  var initial_lat = -18.452941,
      initial_lon = -70.104829;

  // Initial zoom level for the map.
  var initial_zoom = 4;

  // Initial zoom level if input fields have a location.
  var initial_with_loc_zoom = 6;

  // Global variables. Nice.
  var map, marker, $lat, $lon;

  /**
   * Create HTML elements, display map, set up event listeners.
   */
  function initMap() {
    let $ = django.jQuery;
    var $prevEl = $(prev_el_selector);

    if ($prevEl.length === 0) {
      // Can't find where to put the map.
      return;
    };

    $lat = $(lat_input_selector);
    $lon = $(lon_input_selector);

    var has_initial_loc = ($lat.val() && $lon.val());
    if (has_initial_loc) {
        initial_lat = parseFloat($lat.val());
        initial_lon = parseFloat($lon.val());
        initial_zoom = initial_with_loc_zoom;
    };
    $prevEl.after( $('<hr>') );
    $prevEl.after( $('<p><small>Georeferencia la ubicación.</small></p>') );
    $prevEl.after( $('<div class="js-setloc-map setloc-map"></div>') );


    var mapEl = document.getElementsByClassName('js-setloc-map')[0];

    map = new google.maps.Map(mapEl, {
      zoom: initial_zoom,
      center: {lat: initial_lat, lng: initial_lon}
    });

    initAutocomplete()

    // Create but don't position the marker:
    marker = new google.maps.Marker({
      map: map,
      draggable: true,
    });

    if (has_initial_loc) {
      // There is lat/lon in the fields, so centre the marker on that.
      setMarkerPosition(initial_lat, initial_lon);
    };

    google.maps.event.addListener(map, 'click', function(ev) {
      setMarkerPosition(ev.latLng.lat(), ev.latLng.lng());
    });

    google.maps.event.addListener(marker, 'dragend', function() {
      setInputValues(marker.getPosition().lat(), marker.getPosition().lng());
    });
  };

  /**
   * Re-position marker and set input values.
   */
  function setMarkerPosition(lat, lon) {
    marker.setPosition({lat: lat, lng: lon});
    setInputValues(lat, lon);
  };

  /**
   * Set both lat and lon input values.
   */
  function setInputValues(lat, lon) {
    setInputValue($lat, lat);
    setInputValue($lon, lon);
  };

  /**
   * Set the value of $input to val, with the correct decimal places.
   * We work out decimal places using the <input>'s step value, if any.
   */
  function setInputValue($input, val) {
    // step should be like "0.000001".
    var step = $input.prop('step');
    var dec_places = 0;

    if (step) {
      if (step.split('.').length == 2) {
        dec_places = step.split('.')[1].length;
      };

      val = val.toFixed(dec_places);
    };

    $input.val(val);
  };

  // $ = $;
  // $(document).ready(function(){
  //   initMap();
  // });
  window.onload = function (){
    initMap();
  }

  // add search

    function initAutocomplete() {
        $ = django.jQuery;
        //var map = mapa;
        // We'll insert the map after this element:
         var prev_selector = '.form-row.field-longitude';
         var $prevE = $(prev_selector);

        // Create the search box and link it to the UI element.
        var input_ = document.createElement("input");        // Create a <button> element
        input_.id = "pac-input";
        input_.className = "pcontrols";
        input_.placeholder = "Buscar en Google Maps";
        input_.type = "text";
        $prevE.after(input_);
        var input = document.getElementsByClassName('pcontrols')[0];

        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          console.log('places', places);
          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          /*markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];*/

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // set address input
            console.log('place', place);
            $(address_input_selector).val(place.name);

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon:  {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#3177c6',
                        fillOpacity: 0.6,
                        scale: 11,
                        strokeColor: '#3177c6',
                        strokeWeight: 3
                      },
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }
  // end search

})(django.jQuery);
