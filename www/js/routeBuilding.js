function initMapOld() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -26.199076, lng:28.047540}  // Australia.
  });

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel')
  });

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  displayRoute('gandhi square, JHB', 'Pretoria Central, Pretoria', directionsService,
      directionsDisplay);
}
// 
function displayRouteOld(origin, destination, service, display) {
  service.route({
    origin: origin,
    destination: destination,
    waypoints: [{location:{lat:-26.199383,lng:28.047889}},{location: {lat:-26.188246, lng:28.047125}},{location: {lat:-26.162288, lng:28.056813}},{location: {lat:-25.990512, lng:28.076669}}],
    travelMode: 'DRIVING',
    avoidTolls: false
  }, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

function initMap() {
  //onML();
	maps_loader_flag = true;
  var mp = new google.maps.Map(mapDiv, {
    center: {lat: lt, lng: ln},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  directionsService = new google.maps.DirectionsService;
  dd = new google.maps.DirectionsRenderer({
    draggable: true,
    map: mp
  });
  dd.addListener('directions_changed', function () {
    //computeTotalDistance(directionsDisplay.getDirections());
  });
  
  //var marker = new google.maps.Marker(
  //{position: {lat: lt, lng: ln},waypoints: [{location: {lat: -26.188246, lng: 28.047125}}, {location: {lat: -26.162288, lng: 28.056813}}, {location: {lat: -25.990512, lng: 28.076669}}],
  //map: mp, title: "where i am"});
}
function load() {
  newWalkingRoute(rts.selected,directionsService);
}

function displayRoute(origin, destination, service, mode) {
  if (mode === undefined || mode === 1)
    service.route(
        {
          origin: origin,
          destination: destination,
          travelMode: 'WALKING',
          avoidTolls: false
        }, function (response, status) {
      if (status === 'OK') {
        dd.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  else if (mode === 2) {
    if (rt[1])
      service.route({
        origin: {lat: -26.199383, lng: 28.047889},
        destination: destination,
        waypoints: [{location: {lat: -26.188246, lng: 28.047125}}, {location: {lat: -26.162288, lng: 28.056813}}, {location: {lat: -25.990512, lng: 28.076669}}],
        travelMode: 'DRIVING',
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          dd.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
      else if (rt[2])
      service.route({//yeovile
        origin: BramPnp.points[0],
        destination: {lat: rts.BramPnp.p6.lat, lng: rts.BramPnp.p6.lng},
        waypoints: BramPnp.points,
        travelMode: 'DRIVING',
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          dd.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
    else if (rt[0])
      service.route({
        origin: {lat: -26.199383, lng: 28.047889},
        destination: destination,
        waypoints: [{location: {lat: -26.199383, lng: 28.047889}}, {location: {lat: -26.188246, lng: 28.047125}}, {address: "burgers Park,Pretoria"}],
        travelMode: 'DRIVING',
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          dd.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
  }
}
function setRO(op) {
  
  if (op === 0) {
    rts.selected = rts.BramPnp;
  } else if (op === 1) {
  	rts.selected = rts.far;
  } else {
  	rts.selected = rts.oli;
  }
  $.mobile.changePage("#mp");
  cal();
}
/**
 * 
 * @param {location:{lat:*,long:*}} p0 
 * @param {location:{lat:*,long:*}} p1 
 */
function calcDistancePoints(p0,p1){
  //root of (delta(x) squared + delta (y) squared)
  var x = p0.location.lat - p1.location.lat;
  var y = p0.location.lng - p1.location.lng;
  var fz = Math.pow(x,2)  +  Math.pow(y,2);
  return Math.sqrt(fz);
}

function go(ths,to){
  if (ths !== undefined || ths !== null)
  this.event.preventDefault();
  $.mobile.changePage(to);
}

/** 
 * displayRoute Call back broken down
 * */

function newTaxiRoute(selected,service){
	service.route({
        origin: selected.points[0].location,
        destination: selected.points[selected.points.length-1].location,
        waypoints: selected.points,
        travelMode: 'DRIVING',
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          dd.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
}
function newWalkingRoute(selected,service){
	service.route({
        origin: {lat:lt,lng:ln},
        destination: selected.points[0].location,
        travelMode: 'WALKING',
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          dd.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
			}
	);
}

$(function(){
	$(document).ajaxStart(function(){
		$.mobile.loading("show", {});
	});
	$(document).ajaxComplete(function(){
		$.mobile.loading("hide", {});
	});
});