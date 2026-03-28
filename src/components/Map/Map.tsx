import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { MapOverlay } from './MapOverlay';
import { theme } from '../../styles/GlobalStyles';

export const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { currentChapterIndex, chapters, markers } = useChapter();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: chapters[0].center,
      zoom: chapters[0].zoom,
      pitch: chapters[0].pitch,
      bearing: chapters[0].bearing,
      scrollZoom: false,
      dragPan: true,
      touchZoomRotate: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    // Add markers after map loads
    map.on('load', () => {
      markers.forEach((marker, i) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        if (i === 0) el.classList.add('active-marker');

        // Apply styles
        Object.assign(el.style, {
          width: '18px',
          height: '18px',
          borderRadius: '50% 50% 50% 0',
          background: theme.colors.gold,
          border: `2px solid ${theme.colors.cream}`,
          transform: 'rotate(-45deg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        });

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'rotate(-45deg) scale(1.3)';
          el.style.boxShadow = '0 3px 14px rgba(0,0,0,0.5)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'rotate(-45deg)';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
        });

        const popup = new maplibregl.Popup({ offset: 20, closeButton: true })
          .setHTML(`<h3>${marker.label}</h3><p>${marker.sub}</p>`);

        const mapMarker = new maplibregl.Marker({ element: el })
          .setLngLat(marker.coords)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(mapMarker);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [chapters, markers]);

  // Update map view when chapter changes
  useEffect(() => {
    if (!mapRef.current) return;

    const chapter = chapters[currentChapterIndex];
    mapRef.current.flyTo({
      center: chapter.center,
      zoom: chapter.zoom,
      pitch: chapter.pitch,
      bearing: chapter.bearing,
      duration: 2800,
      essential: true,
      curve: 1.4,
    });

    // Update active markers
    const activeIndices = chapter.markerIndices;
    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      const isActive = activeIndices.includes(i);
      
      if (isActive) {
        el.classList.add('active-marker');
        el.style.background = theme.colors.accent;
        el.style.width = '22px';
        el.style.height = '22px';
      } else {
        el.classList.remove('active-marker');
        el.style.background = theme.colors.gold;
        el.style.width = '18px';
        el.style.height = '18px';
      }
    });
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
  height: 100vh;
  flex-shrink: 0;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
`;
