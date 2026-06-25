// Coordinates of KPU Surrey Library
const kpuLibrary = {
  lat: 49.1329,
  lng: -122.8718
};

// Leaflet map centered on KPU Surrey Library
const map = L.map("map").setView([kpuLibrary.lat, kpuLibrary.lng], 14);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Add a marker for KPU Surrey Library
const kpuMarker = L.marker([kpuLibrary.lat, kpuLibrary.lng])
  .addTo(map)
  .bindPopup("KPU Surrey Library")
  .openPopup();

// Variables to hold user marker and route line
let userMarker;
let routeLine;

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Radius of the Earth in kilometers
  const earthRadius = 6371;

  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return earthRadius * c;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Function to update user's location on the map
function updateLocation(position) {
  // Get user's latitude and longitude
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  // Update status with user's coordinates
  document.getElementById("status").textContent =
    `Your location: ${userLat.toFixed(5)}, ${userLng.toFixed(5)}`;
  // Calculate distance to KPU Surrey Library
  const distance = calculateDistance(
    userLat,
    userLng,
    kpuLibrary.lat,
    kpuLibrary.lng
  );

  // Update distance display
  document.getElementById("distance").textContent =
    `Distance to KPU Surrey Library: ${distance.toFixed(2)} km`;

 // Update or create user marker
  if (userMarker) {
    userMarker.setLatLng([userLat, userLng]);
  } else {
    userMarker = L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("Your current location");
  }

  // Update or create route line from user to KPU Surrey Library
  if (routeLine) {
    routeLine.setLatLngs([
      [userLat, userLng],
      [kpuLibrary.lat, kpuLibrary.lng]
    ]);
  } else {
    routeLine = L.polyline([
      [userLat, userLng],
      [kpuLibrary.lat, kpuLibrary.lng]
    ]).addTo(map);
  }

  // Fit map bounds to show both user location and KPU Surrey Library
  map.fitBounds(routeLine.getBounds());
}

// Function to handle location errors
function locationError(error) {
  document.getElementById("status").textContent =
    "Unable to access location. Please allow location permission.";
}

// Check if geolocation is available in the browser
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(updateLocation, locationError, {
    enableHighAccuracy: true
  });
} else {
  document.getElementById("status").textContent =
    "Geolocation is not supported by this browser.";
}