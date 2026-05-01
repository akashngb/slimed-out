window.addEventListener('message', async (event) => {
  const { type, payload } = event.data;
  
  if (type === 'INIT_MAP') {
    try {
      const { apiKey, userLocation, participants, theme } = payload;
      
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      renderMap(userLocation, participants, theme || 'dark');
    } catch (e) {
      console.error('Google Maps failed to load in sandbox:', e);
    }
  }

  if (type === 'CHANGE_THEME') {
    if (!map) return;
    const { theme } = payload;
    
    renderMap(currentUserLocation, currentParticipants, theme);
  }

  if (type === 'UPDATE_LOCATION') {
    if (!seekerMarker) return;
    const newPos = payload;
    currentUserLocation = newPos;
    seekerMarker.position = newPos;
  }
});

function getDarkStyles() {
  return [
    { "elementType": "geometry", "stylers": [{ "color": "#0a0a0f" }] }, // Deep space
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#4a4a5a" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0a0a0f" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#1a1a25" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1a1a2b" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#3a3a4a" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
  ];
}

function getLightStyles() {
  return [
    { "elementType": "geometry", "stylers": [{ "color": "#f8fafc" }] }, // Clean slate
    { "elementType": "labels.icon", "stylers": [{ "visibility": "on" }, { "saturation": -100 }, { "lightness": 20 }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "simplified" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
  ];
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function offsetLatLng(lat, lng, distKm) {
  const bearing = Math.random() * 2 * Math.PI;
  const R = 6371; // Earth radius km
  const dLat = (distKm * Math.cos(bearing)) / R * (180 / Math.PI);
  const dLng = (distKm * Math.sin(bearing)) / (R * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);
  return { lat: lat + dLat, lng: lng + dLng };
}

let map = null;
let seekerMarker = null;

let currentUserLocation = null;
let currentParticipants = null;
let currentOpponentPos = null;

function renderMap(userLocation, participants, theme) {
  // Store globally so we can re-render on theme toggle
  currentUserLocation = userLocation || currentUserLocation;
  currentParticipants = participants || currentParticipants;

  const container = document.getElementById('map');
  const isDark = theme === 'dark';
  document.body.style.backgroundColor = isDark ? '#0a0a0f' : '#f8fafc';
  
  map = new google.maps.Map(container, {
    center: currentUserLocation,
    zoom: 15,
    backgroundColor: isDark ? '#0a0a0f' : '#f8fafc',
    mapId: 'slimed-out-basic-arena',
    // colorScheme is used instead of styles — mapId causes styles to be ignored
    colorScheme: isDark ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT,
    disableDefaultUI: true,
    zoomControl: false,
    gestureHandling: 'greedy',
    scrollwheel: true // Explicitly enable for trackpad pinching
  });

  // User Marker (Seeker) — keep a reference so we can move it live
  seekerMarker = createPhotoMarker(
    currentUserLocation, 
    currentParticipants?.seeker?.photo, 
    '#22C55E'
  );
  
  // Opponent Marker (nearby) - only generate random position once
  if (!currentOpponentPos) {
    const dist = randomBetween(0.3, 0.8);
    currentOpponentPos = offsetLatLng(currentUserLocation.lat, currentUserLocation.lng, dist);
  }
  
  createPhotoMarker(
    currentOpponentPos, 
    currentParticipants?.opponent?.photo, 
    '#FF2D2D'
  );

  // Pan map to fit both
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(currentUserLocation);
  bounds.extend(currentOpponentPos);
  map.fitBounds(bounds, { padding: 100 });
}

function createPhotoMarker(position, photoUrl, borderColor) {
  const markerDiv = document.createElement('div');
  markerDiv.style.width = '48px';
  markerDiv.style.height = '48px';
  markerDiv.style.backgroundColor = '#1a1a2b';
  markerDiv.style.borderRadius = '50%';
  markerDiv.style.border = `2px solid ${borderColor}`;
  markerDiv.style.boxShadow = `0 0 20px ${borderColor}44`;
  markerDiv.style.padding = '2px';
  markerDiv.style.overflow = 'hidden';
  markerDiv.style.display = 'flex';
  markerDiv.style.alignItems = 'center';
  markerDiv.style.justifyContent = 'center';

  if (photoUrl) {
    const img = document.createElement('img');
    img.src = photoUrl;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    markerDiv.appendChild(img);
  } else {
    markerDiv.style.background = `linear-gradient(135deg, ${borderColor}, #000)`;
  }

  return new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    content: markerDiv
  });
}
