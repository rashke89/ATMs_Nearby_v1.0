var map,
  infowindow,
  latitude,
  longitude,
  atmList = document.getElementById('list'),
  wrap = document.getElementById('wrap'),
  wrapDeny = document.getElementsByClassName('wrapDeny')[0],
  jumbotron = document.getElementsByClassName('jumbotron')[0],
  atm_h1 = document.getElementsByClassName('atm_h1')[0];

// reload page
function reload() {
  location.reload();
}

// init function for geolocation
function initMap() {
  getLocation();
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  navigator.geolocation.getCurrentPosition(
    // if user accept
    () => {
      jumbotron.style.height = '200px';
      atm_h1.style.lineHeight = '100%';
    },
    // if user deny
    () => {
      jumbotron.style.height = '200px';
      atm_h1.style.lineHeight = '100%';
      wrapDeny.style.opacity = '1';
    });

  // show position on map
  function showPosition(position) {
    wrap.style.display = 'block';
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    // user position
    var userPosition = {
      lat: latitude,
      lng: longitude
    };

    // show on map
    setTimeout(() => {
      map = new google.maps.Map(document.getElementById('map'), {
        center: userPosition,
        zoom: 15
      });
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);

      // nearby search
      service.nearbySearch({
        location: userPosition,
        radius: 5000,
        types: ['atm']
      }, call_back);
    }, 700)
  }// end show position on map

  // call back function
  function call_back(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var results = results;
      // console.log(results);

      // calculate distance
      for (let i = 0; i < results.length; i++) {
        var latLngA = new google.maps.LatLng(latitude, longitude);
        var latLngB = new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng());
        var distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB));

        // set distance for each atm
        results[i].distance = distance;

        // mark ATMs on map
        atmMarker(results[i]);
      };

      var cur = 1;
      for (let i = 0; i < 10; i++) {

        // sort ATMs by distance
        results.sort((a, b) => {
          return a.distance - b.distance
        });

        // create div list of ATMs
        var atmDiv = document.createElement('div');
        atmDiv.innerHTML = '<p class="atmName">' + (cur++) + '. ' + results[i].name + '<span class="pull-right atmDist"> dist: ' + results[i].distance + ' m</span></p><hr style="margin: 10px 0">';
        atmList.appendChild(atmDiv);
      }
    }
  }// end call back function

  // create marker for ATMs
  function atmMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }// end create marker function

};// end init function
