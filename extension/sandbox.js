window.addEventListener('message', async (event) => {
  const { type, payload } = event.data;
  
  if (type === 'INIT_MAP') {
    try {
      const { apiKey, userLocation, participants } = payload;
      
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      renderMap(userLocation, participants);
    } catch (e) {
      console.error('Google Maps failed to load in sandbox:', e);
    }
  }

  if (type === 'CHANGE_THEME') {
    if (!map) return;
    const { theme } = payload;
    
    const isDark = theme === 'dark';
    map.setOptions({
      colorScheme: isDark ? 'DARK' : 'LIGHT',
      styles: isDark ? getDarkStyles() : getLightStyles()
    });
  }
});

function getDarkStyles() {
  return [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
  ];
}

function getLightStyles() {
  return [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
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

function renderMap(userLocation, participants) {
  const container = document.getElementById('map');
  
  map = new google.maps.Map(container, {
    center: userLocation,
    zoom: 15,
    mapId: 'slimed-out-basic-arena',
    colorScheme: 'DARK', 
    disableDefaultUI: true,
    zoomControl: false,
    styles: getDarkStyles()
  });

  // User Marker (Seeker)
  createPhotoMarker(
    userLocation, 
    participants?.seeker?.photo, 
    '#22C55E'
  );
  
  // Opponent Marker (nearby)
  const dist = randomBetween(0.3, 0.8);
  const opponentPos = offsetLatLng(userLocation.lat, userLocation.lng, dist);
  createPhotoMarker(
    opponentPos, 
    participants?.opponent?.photo, 
    '#FF2D2D'
  );

  // Pan map to fit both
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(userLocation);
  bounds.extend(opponentPos);
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

  new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    content: markerDiv
  });
}
