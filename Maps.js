let map;
let userLocation;
let userMarker;
let searchCircle;
let serviceMarkers = [];
let routePolyline = null;
let foundPlaces = [];
const defaultCenter = {
  lat: 0.3476,
  lng: 32.5825,
};

/* Initialize Map */

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 13,
    mapTypeControl: false,
  });

  /* Detect User Location */

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userLocation);

        userMarker = new google.maps.Marker({
          map: map,
          position: userLocation,
          title: "You are here",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        document.getElementById("status").innerText =
          "Location detected successfully.";

        searchNearbyServices();
      },

      (error) => {
        console.log(error);

        document.getElementById("status").innerText =
          "Location permission denied.";
      },
    );
  } else {
    alert("Geolocation not supported.");
  }
}

/* Search Nearby Services */

async function searchNearbyServices() {
  clearMap();

  const radius = Number(document.getElementById("radius").value);

  document.getElementById("status").innerText =
    "Searching nearby repair shops...";

  /* Draw Search Radius */

  searchCircle = new google.maps.Circle({
    map: map,
    center: userLocation,
    radius: radius,
    fillColor: "#2563eb",
    fillOpacity: 0.1,
    strokeColor: "#2563eb",
    strokeWeight: 2,
  });

  /* Import Places Library */

  const { Place } = await google.maps.importLibrary("places");

  try {
    const request = {
      textQuery: "phone repair",
      fields: ["displayName", "location", "formattedAddress"],
      locationBias: userLocation,
      maxResultCount: 20,
    };

    const { places } = await Place.searchByText(request);

    if (!places || places.length === 0) {
      showEmpty("No nearby repair shops found.");

      return;
    }

    /* Filter Results By Radius */

    const filteredPlaces = places.filter((place) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLocation),
        place.location,
      );

      return distance <= radius;
    });

    foundPlaces = filteredPlaces;

    displayResults(filteredPlaces);
  } catch (error) {
    console.error(error);

    document.getElementById("status").innerText = "Search failed.";
  }
}

/* Display Results */

function displayResults(places) {
  const results = document.getElementById("results");

  results.innerHTML = "";

  places.forEach((place, index) => {
    const marker = new google.maps.Marker({
      map: map,
      position: place.location,
      title: place.displayName,
    });

    serviceMarkers.push(marker);

    marker.addListener("click", () => {
      showDirections(index);
    });

    const card = document.createElement("div");

    card.className = "result-card";

    card.innerHTML = `

<h3 class="result-title">
${place.displayName}
</h3>

<p class="result-meta">
${place.formattedAddress || ""}
</p>

<div class="result-actions">

<button class="small-btn primary-btn"
onclick="showDirections(${index})">
Get Directions
</button>

<button class="small-btn secondary-btn"
onclick="zoomToPlace(${index})">
Show on Map
</button>

</div>

`;

    results.appendChild(card);
  });

  document.getElementById("status").innerText =
    `${places.length} repair shops found.`;
}

/* Show Directions */

async function showDirections(index) {
  const place = foundPlaces[index];

  if (!place) return;

  /* Remove Existing Route */

  if (routePolyline) {
    routePolyline.setMap(null);
  }

  const { Route } = await google.maps.importLibrary("routes");

  try {
    const request = {
      origin: userLocation,
      destination: place.location,
      travelMode: "DRIVING",
      fields: ["path"],
    };

    const { routes } = await Route.computeRoutes(request);

    if (!routes || !routes.length) {
      alert("Could not get directions.");

      return;
    }

    /* Draw Route */

    routePolyline = routes[0].createPolylines()[0];

    routePolyline.setMap(map);

    /* Fit Route */

    const bounds = new google.maps.LatLngBounds();

    routes[0].path.forEach((point) => {
      bounds.extend(point);
    });

    map.fitBounds(bounds);

    document.getElementById("status").innerText =
      `Directions to ${place.displayName}`;
  } catch (error) {
    console.error(error);

    alert("Could not get directions.");
  }
}

/* Zoom To Place */

function zoomToPlace(index) {
  const place = foundPlaces[index];

  map.setCenter(place.location);

  map.setZoom(16);
}

/* Clear Old Data */

function clearMap() {
  serviceMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  serviceMarkers = [];

  if (routePolyline) {
    routePolyline.setMap(null);
  }

  if (searchCircle) {
    searchCircle.setMap(null);
  }
}

/* Empty State */

function showEmpty(message) {
  document.getElementById("results").innerHTML = `
<div class="empty">${message}</div>
`;
}

/* Search Button */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", () => {
    if (userLocation) {
      searchNearbyServices();
    }
  });
});
