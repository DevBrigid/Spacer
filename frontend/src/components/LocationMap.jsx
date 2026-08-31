import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hasCoordinates } from '../utils/location';

const DEFAULT_LOCATION = { latitude: -1.286389, longitude: 36.817223 };
const markerIcon = L.divIcon({
  className: 'space-map-pin',
  html: '<span aria-hidden="true"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function LocationMap({ latitude, longitude, location = 'Space location', className = '' }) {
  const mapElementRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const coordinates = hasCoordinates(latitude, longitude)
    ? { latitude: Number(latitude), longitude: Number(longitude) }
    : DEFAULT_LOCATION;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;

  useEffect(() => {
    const map = L.map(mapElementRef.current, { dragging: false, scrollWheelZoom: false, zoomControl: false, keyboard: false })
      .setView([coordinates.latitude, coordinates.longitude], 15);
    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);
    tiles.on('tileerror', () => setMapError(true));
    L.marker([coordinates.latitude, coordinates.longitude], { icon: markerIcon }).addTo(map);
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
    };
  }, [coordinates.latitude, coordinates.longitude]);

  return (
    <div className={className}>
      <div ref={mapElementRef} className="location-map" role="img" aria-label={`Map showing ${location}`} />
      {mapError && <p className="map-load-error" role="alert">The map tiles could not load. Check your internet connection and reload the page.</p>}
      {hasCoordinates(latitude, longitude) && (
        <a className="map-directions-link" href={directionsUrl} target="_blank" rel="noreferrer">
          Get directions ↗
        </a>
      )}
    </div>
  );
}
