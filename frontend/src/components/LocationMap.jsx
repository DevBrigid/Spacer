import { useState } from 'react';
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from './ui/mapcn';
import { hasCoordinates } from '../utils/location';

const DEFAULT_LOCATION = { latitude: -1.286389, longitude: 36.817223 };

export default function LocationMap({ latitude, longitude, location = 'Space location', className = '' }) {
  const destination = hasCoordinates(latitude, longitude)
    ? [Number(longitude), Number(latitude)]
    : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude];
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [routeMessage, setRouteMessage] = useState('Use the location control on the map for directions.');

  const loadDirections = async ({ longitude: currentLongitude, latitude: currentLatitude }) => {
    setCurrentLocation([currentLongitude, currentLatitude]);
    setRouteMessage('Finding a driving route…');
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${currentLongitude},${currentLatitude};${destination[0]},${destination[1]}?overview=full&geometries=geojson`);
      const data = await response.json();
      const coordinates = data?.routes?.[0]?.geometry?.coordinates;
      if (!response.ok || !Array.isArray(coordinates)) throw new Error('No route available');
      setRoute(coordinates);
      setRouteMessage(`Driving route to ${location} shown on the map.`);
    } catch {
      setRoute([[currentLongitude, currentLatitude], destination]);
      setRouteMessage('Your location and the destination are shown. A detailed driving route is currently unavailable.');
    }
  };

  const requestDirections = () => {
    if (!navigator.geolocation) {
      setRouteMessage('Directions need a browser that supports location access.');
      return;
    }
    setRouteMessage('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      (position) => loadDirections({ longitude: position.coords.longitude, latitude: position.coords.latitude }),
      () => setRouteMessage('Location permission is required to show directions.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={className}>
      <div className="location-map" role="region" aria-label={`MapCN map showing directions to ${location}`}>
        <Map center={destination} zoom={15}>
          <MapMarker longitude={destination[0]} latitude={destination[1]}>
            <MarkerContent className="space-map-pin"><span /></MarkerContent>
          </MapMarker>
          {currentLocation && <MapMarker longitude={currentLocation[0]} latitude={currentLocation[1]}><MarkerContent><span className="client-map-pin" /></MarkerContent></MapMarker>}
          {route.length > 1 && <MapRoute coordinates={route} color="#171717" width={4} />}
          <MapControls position="top-right" showCompass showLocate showFullscreen onLocate={loadDirections} />
        </Map>
      </div>
      <button type="button" className="map-directions-button" onClick={requestDirections}>
        Show directions from my location
      </button>
      <p className="map-directions-help" role="status">{routeMessage}</p>
    </div>
  );
}
