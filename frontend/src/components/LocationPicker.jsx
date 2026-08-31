import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hasCoordinates } from '../utils/location';

const DEFAULT_CENTER = [-1.286389, 36.817223];

const markerIcon = L.divIcon({
  className: 'space-map-pin',
  html: '<span aria-hidden="true"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [mapError, setMapError] = useState(false);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(DEFAULT_CENTER, 12);
    mapRef.current = map;

    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);
    tiles.on('tileerror', () => setMapError(true));

    const reportLocation = ({ lat, lng }) => {
      onChangeRef.current({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      });
    };

    map.on('click', (event) => reportLocation(event.latlng));
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hasCoordinates(latitude, longitude)) return;

    const position = [Number(latitude), Number(longitude)];
    if (!markerRef.current) {
      markerRef.current = L.marker(position, { draggable: true, icon: markerIcon }).addTo(map);
      markerRef.current.on('dragend', () => onChangeRef.current({
        latitude: markerRef.current.getLatLng().lat.toFixed(6),
        longitude: markerRef.current.getLatLng().lng.toFixed(6),
      }));
    } else {
      markerRef.current.setLatLng(position);
    }
    map.setView(position, Math.max(map.getZoom(), 15));
  }, [latitude, longitude]);

  return (
    <div className="location-picker-wrapper">
      <div ref={containerRef} className="location-picker-map" role="application" aria-label="Map. Click to choose the space location, then drag the pin to refine it." />
      {mapError && <p className="map-load-error" role="alert">The map tiles could not load. Check your internet connection and reload the page.</p>}
    </div>
  );
}
