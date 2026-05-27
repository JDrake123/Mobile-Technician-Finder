// index.js

let map;
let infoWindow;
let placesService;
let userLocation = null;

let radiusCircle = null;
let placeMarkers = [];

let currentRoutePolylines = [];
let currentRouteMarkers = [];

const repairList = document.getElementById("repairList");
const radiusSlider = document.getElementById("radius");
const radiusValue = document.getElementById("radiusValue");
const searchBtn = document.getElementById("searchBtn");

let RouteApi = null;

radiusSlider.addEventListener("input", () => {
  radiusValue.textContent = `${radiusSlider.value} KM`;

  if (map && userLocation) {
    drawRadiusCircle();
  }
});

searchBtn.addEventListener("click", () => {
  if (!map || !userLocation || !placesService) return;

  clearSearchResults();
  drawRadiusCircle();
  searchNearbyRepairs();
});

async function initMap() {
  try {
    const { Map } = await google.maps.importLibrary("maps");
    await google.maps.importLibrary("places");
    const { Route } = await google.maps.importLibrary("routes");

    RouteApi = Route;

    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map = new Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 13,
          mapId: "7bf1d12774162a0e2277f3e6",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        infoWindow = new google.maps.InfoWindow();
        placesService = new google.maps.places.PlacesService(map);

        new google.maps.Marker({
          position: userLocation,
          map,
          title: "Your location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        drawRadiusCircle();
        searchNearbyRepairs();
      },
      () => {
        alert("Location access was denied. Please enable location and refresh the page.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } catch (error) {
    console.error("Failed to initialize map:", error);
    alert("Map could not be loaded.");
  }
}

function drawRadiusCircle() {
  if (!map || !userLocation) return;

  if (radiusCircle) {
    radiusCircle.setMap(null);
  }

  radiusCircle = new google.maps.Circle({
    strokeColor: "#1e88e5",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#1e88e5",
    fillOpacity: 0.15,
    map,
    center: userLocation,
    radius: Number(radiusSlider.value) * 1000,
  });
}

function clearSearchResults() {
  placeMarkers.forEach((marker) => marker.setMap(null));
  placeMarkers = [];

  clearRoute();

  repairList.innerHTML = "";
}

function clearRoute() {
  currentRoutePolylines.forEach((polyline) => polyline.setMap(null));
  currentRoutePolylines = [];

  currentRouteMarkers.forEach((marker) => {
    marker.map = null;
  });
  currentRouteMarkers = [];
}

function searchNearbyRepairs() {
  const radiusMeters = Number(radiusSlider.value) * 1000;

  const request = {
    location: userLocation,
    radius: radiusMeters,
    keyword: "phone repair",
  };

  placesService.nearbySearch(request, (results, status) => {
    if (
      status !== google.maps.places.PlacesServiceStatus.OK ||
      !results ||
      results.length === 0
    ) {
      repairList.innerHTML = `
        <div class="repair-card">
          <h3>No nearby phone repair services found</h3>
          <p>Try increasing the radius.</p>
        </div>
      `;
      return;
    }

    results.forEach((place) => {
      if (!place.place_id) return;
      fetchPlaceDetailsAndRender(place.place_id);
    });
  });
}

function fetchPlaceDetailsAndRender(placeId) {
  placesService.getDetails(
    {
      placeId,
      fields: [
        "name",
        "formatted_phone_number",
        "formatted_address",
        "website",
        "types",
        "geometry",
      ],
    },
    (details, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !details) {
        return;
      }

      createPlaceMarker(details);
      createRepairCard(details);
    }
  );
}

function createPlaceMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP,
  });

  placeMarkers.push(marker);

  marker.addListener("click", () => {
    openInfoWindow(place, marker);
  });
}

function openInfoWindow(place, marker) {
  const content = `
    <div style="max-width:240px">
      <h3 style="margin:0 0 8px 0;">${place.name || "Repair Shop"}</h3>
      <p><strong>Phone:</strong> ${place.formatted_phone_number || "Not available"}</p>
      <p><strong>Address:</strong> ${place.formatted_address || "Not available"}</p>
      <p><strong>Deals in:</strong> ${
        place.types && place.types.length ? place.types.join(", ") : "Phone repairs"
      }</p>
      <p><strong>Email:</strong> Not Available</p>
      ${
        place.website
          ? `<p><a href="${place.website}" target="_blank" rel="noopener noreferrer">Website</a></p>`
          : ""
      }
    </div>
  `;

  infoWindow.setContent(content);
  infoWindow.open(map, marker);
}

function createRepairCard(place) {
  const card = document.createElement("div");
  card.className = "repair-card";

  card.innerHTML = `
    <h3>${place.name || "Phone Repair Service"}</h3>
    <p><strong>Phone:</strong> ${place.formatted_phone_number || "Not available"}</p>
    <p><strong>Email:</strong> Not Available</p>
    <p><strong>Address:</strong> ${place.formatted_address || "Not available"}</p>
    <p><strong>Deals in:</strong> ${
      place.types && place.types.length ? place.types.join(", ") : "Phone repairs"
    }</p>
    ${
      place.website
        ? `<p><a href="${place.website}" target="_blank" rel="noopener noreferrer">Visit website</a></p>`
        : ""
    }
    <button class="direction-btn" type="button">Get Directions</button>
  `;

  const btn = card.querySelector(".direction-btn");

  btn.addEventListener("click", () => {
    if (!place.geometry || !place.geometry.location) {
      alert("Destination location is missing.");
      return;
    }

    getRouteToService({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  });

  repairList.appendChild(card);
}

async function getRouteToService(destinationLatLng) {
  if (!RouteApi || !map || !userLocation) return;

  try {
    clearRoute();

    const request = {
      origin: userLocation,
      destination: destinationLatLng,
      travelMode: "DRIVING",
      fields: ["path"],
    };

    const { routes } = await RouteApi.computeRoutes(request);

    if (!routes || routes.length === 0) {
      alert("No route found for this destination.");
      return;
    }

    const route = routes[0];

    currentRoutePolylines = route.createPolylines();
    currentRoutePolylines.forEach((polyline) => polyline.setMap(map));

    currentRouteMarkers = await route.createWaypointAdvancedMarkers();
    currentRouteMarkers.forEach((marker) => {
      marker.map = map;
    });

    if (route.path && route.path.length) {
      fitMapToPath(route.path);
    }
  } catch (error) {
    console.error("Route error:", error);
    alert("Could not get directions for this location.");
  }
}

function fitMapToPath(path) {
  if (!path || !path.length) return;

  const bounds = new google.maps.LatLngBounds();
  path.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds);
}

window.initMap = initMap;