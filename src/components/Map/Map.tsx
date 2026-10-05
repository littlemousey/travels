import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { MapOverlay } from './MapOverlay';
import { theme } from '../../styles/GlobalStyles';
import { createMarkerElement, setMarkerActive } from '../../utils/createMarkerElement';
import type { Chapter, Marker } from '../../types';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const getCamera = ({ center, zoom, pitch, bearing }: Chapter) => ({ center, zoom, pitch, bearing });

function addMarkers(map: maplibregl.Map, markers: Marker[]): maplibregl.Marker[] {
  return markers.map((marker) => {
    const { outerEl } = createMarkerElement();
    const popup = new maplibregl.Popup({ offset: 20, closeButton: true })
      .setHTML(`<h3>${marker.label}</h3><p>${marker.sub}</p>`);

    return new maplibregl.Marker({ element: outerEl, anchor: 'bottom' })
      .setLngLat(marker.coords)
      .setPopup(popup)
      .addTo(map);
  });
}

function highlightMarkers(mapMarkers: maplibregl.Marker[], activeIndices: number[]): void {
  mapMarkers.forEach((marker, i) => setMarkerActive(marker.getElement(), activeIndices.includes(i)));
}

export const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { currentChapterIndex, chapters, markers } = useChapter();
  // Always-current ref so async map.on('load') can read the latest chapter index
  const currentChapterIndexRef = useRef(currentChapterIndex);
  currentChapterIndexRef.current = currentChapterIndex;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      ...getCamera(chapters[0]),
    });
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    map.on('load', () => {
      markersRef.current = addMarkers(map, markers);
      highlightMarkers(markersRef.current, chapters[currentChapterIndexRef.current].markerIndices);
    });

    mapRef.current = map;
    return () => map.remove();
  }, [chapters, markers]);

  // Update map view when chapter changes
  useEffect(() => {
    if (!mapRef.current) return;

    const chapter = chapters[currentChapterIndex];
    highlightMarkers(markersRef.current, chapter.markerIndices);
    mapRef.current.flyTo({ ...getCamera(chapter), duration: 2800, essential: true, curve: 1.4 });
  }, [currentChapterIndex, chapters]);

  return (
    <MapContainer>
      <MapDiv ref={mapContainerRef} />
      <MapOverlay />
    </MapContainer>
  );
};

const MapContainer = styled.div`
  position: sticky;
  top: 0;
  width: 55%;
  height: 100%;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
    height: 45%;
    position: relative;
  }
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;

  /* MapLibre popup styling */
  .maplibregl-popup-close-button,
  .mapboxgl-popup-close-button {
    font-size: 20px;
    padding: 0 6px;
    color: ${theme.colors.muted};
    background: transparent;
    border: none;
    cursor: pointer;
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: ${theme.colors.ink};
    }
    
    &:focus {
      outline: none;
      border: 1px solid transparent;
    }
    
    &:focus-visible {
      outline: 2px solid ${theme.colors.gold};
      outline-offset: 2px;
    }
  }

  .maplibregl-popup-content,
  .mapboxgl-popup-content {
    padding: 12px 16px;
    font-family: ${theme.fonts.body};
    
    h3 {
      margin: 0 0 4px 0;
      font-family: ${theme.fonts.heading};
      font-size: 0.95rem;
      font-weight: 500;
      color: ${theme.colors.ink};
    }
    
    p {
      margin: 0;
      font-size: 0.8rem;
      color: ${theme.colors.muted};
    }
  }
`;
