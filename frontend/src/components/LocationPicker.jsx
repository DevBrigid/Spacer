import { useEffect } from 'react';
import { Map, MapControls, MapMarker, MarkerContent, useMap } from './ui/mapcn';
import { hasCoordinates } from '../utils/location';

const DEFAULT_CENTER = [36.817223, -1.286389];

function MapClickHandler({ onChange }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return undefined;
    const handleClick = (event) => onChange({
      latitude: event.lngLat.lat.toFixed(6),
      longitude: event.lngLat.lng.toFixed(6),
    });
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onChange]);

  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }) {
  const position = hasCoordinates(latitude, longitude)
    ? [Number(longitude), Number(latitude)]
    : DEFAULT_CENTER;
  const updatePosition = ({ latitude: nextLatitude, longitude: nextLongitude }) => {
    onChange({ latitude: String(nextLatitude), longitude: String(nextLongitude) });
  };

  return (
    <div className="location-picker-wrapper">
      <div className="location-picker-map" role="application" aria-label="MapCN map. Click to choose the space location, then drag the pin to refine it.">
        <Map center={position} zoom={hasCoordinates(latitude, longitude) ? 15 : 11} scrollZoom={false}>
          <MapClickHandler onChange={updatePosition} />
          <MapMarker
            longitude={position[0]}
            latitude={position[1]}
            draggable
            onDragEnd={({ lat, lng }) => updatePosition({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) })}
          >
            <MarkerContent className="space-map-pin"><span /></MarkerContent>
          </MapMarker>
          <MapControls position="top-right" showCompass showLocate showFullscreen />
        </Map>
      </div>
      <p className="field-help">Click the map or drag the pin to save the exact location.</p>
    </div>
  );
}
