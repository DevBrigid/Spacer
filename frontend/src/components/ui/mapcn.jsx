/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapContext = createContext(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a Map component');
  }
  return context;
}

function Map({
  children,
  center = [36.817223, -1.286389],
  zoom = 11,
  scrollZoom = true,
  style,
  className = '',
}) {
  const containerRef = useRef(null);
  const [map, setMap] = useState(null);
  const initialMapOptions = useRef({ center, zoom, scrollZoom, style });

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const mapInstance = new maplibregl.Map({
      container: containerRef.current,
      style: initialMapOptions.current.style || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: initialMapOptions.current.center,
      zoom: initialMapOptions.current.zoom,
      scrollZoom: initialMapOptions.current.scrollZoom,
    });

    // Mark the map ready only after its style has loaded. Route layers cannot
    // be added safely before this point.
    const handleLoad = () => setMap(mapInstance);
    mapInstance.once('load', handleLoad);

    return () => {
      mapInstance.off('load', handleLoad);
      mapInstance.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    map.jumpTo({ center, zoom });
  }, [map, center, zoom]);

  const value = useMemo(() => ({ map }), [map]);

  return (
    <MapContext.Provider value={value}>
      <div ref={containerRef} className={className || 'map-container'} style={{ width: '100%', height: '100%' }}>
        {map && children}
      </div>
    </MapContext.Provider>
  );
}

export { Map };

export function MarkerContent({ children, className = '' }) {
  const { marker } = useMarkerContext();

  if (!marker) return null;

  return createPortal(
    <div className={className}>{children}</div>,
    marker.getElement(),
  );
}

const MarkerContext = createContext(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error('Marker components must be used within MapMarker');
  }
  return context;
}

export function MapMarker({
  longitude,
  latitude,
  children,
  draggable = false,
  onDragEnd,
}) {
  const { map } = useMap();
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!map) return undefined;

    const markerInstance = new maplibregl.Marker({
      draggable,
      element: document.createElement('div'),
    })
      .setLngLat([longitude, latitude]);

    const handleDragEnd = () => {
      const lngLat = markerInstance.getLngLat();
      onDragEnd?.({ lat: lngLat.lat, lng: lngLat.lng });
    };

    markerInstance.on('dragend', handleDragEnd);
    markerInstance.addTo(map);
    // State triggers a render after the MapLibre marker exists, allowing
    // MarkerContent to portal its visual pin into the marker element. Queue
    // it after the external map mutation to avoid a synchronous effect update.
    const frameId = requestAnimationFrame(() => setMarker(markerInstance));

    return () => {
      cancelAnimationFrame(frameId);
      markerInstance.off('dragend', handleDragEnd);
      markerInstance.remove();
    };
  }, [map, longitude, latitude, draggable, onDragEnd]);

  return (
    <MarkerContext.Provider value={{ marker }}>
      {children}
    </MarkerContext.Provider>
  );
}

export function MapControls({
  position = 'top-right',
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  onLocate,
  className = '',
}) {
  const { map } = useMap();

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div className={`absolute z-10 flex flex-col gap-1 ${positionClasses[position]} ${className}`}>
      {showZoom && (
        <div className="flex flex-col overflow-hidden rounded-md border border-stone-300 bg-white shadow-sm">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center hover:bg-stone-100"
            aria-label="Zoom in"
            onClick={() => map?.zoomIn()}
          >
            +
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center border-t border-stone-300 hover:bg-stone-100"
            aria-label="Zoom out"
            onClick={() => map?.zoomOut()}
          >
            −
          </button>
        </div>
      )}
      {showCompass && (
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white shadow-sm hover:bg-stone-100"
          aria-label="Reset bearing"
          onClick={() => map?.resetNorthPitch()}
        >
          N
        </button>
      )}
      {showLocate && (
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white shadow-sm hover:bg-stone-100"
          aria-label="Find my location"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((position) => {
              const coordinates = {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
              };
              map?.flyTo({ center: [coordinates.longitude, coordinates.latitude], zoom: 14, essential: true });
              onLocate?.(coordinates);
            });
          }}
        >
          ⌖
        </button>
      )}
      {showFullscreen && (
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white shadow-sm hover:bg-stone-100"
          aria-label="Toggle fullscreen"
          onClick={() => {
            const container = map?.getContainer();
            if (!container) return;
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              container.requestFullscreen();
            }
          }}
        >
          ⤢
        </button>
      )}
    </div>
  );
}

export function MapRoute({ coordinates, color = '#171717', width = 4, opacity = 0.8 }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !Array.isArray(coordinates) || coordinates.length < 2) return undefined;

    const sourceId = `route-source-${Math.random().toString(36).slice(2, 9)}`;
    const layerId = `route-layer-${sourceId}`;

    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: {},
      },
    });

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': color,
        'line-width': width,
        'line-opacity': opacity,
      },
    });

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, coordinates, color, width, opacity]);

  return null;
}

export default Map;
