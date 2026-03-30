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
        // Outer container - MapLibre will position this
        const outerEl = document.createElement('div');
        outerEl.className = 'marker-container';
        Object.assign(outerEl.style, {
          width: '18px',
          height: '18px',
        });

        // Inner element - our styling and animations
        const innerEl = document.createElement('div');
        innerEl.className = 'custom-marker';
        if (i === 0) innerEl.classList.add('active-marker');

        Object.assign(innerEl.style, {
          width: '100%',
          height: '100%',
          borderRadius: '50% 50% 50% 0',
          background: theme.colors.gold,
          border: `2px solid ${theme.colors.cream}`,
          transform: 'rotate(-45deg)',
          transformOrigin: 'center center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        });

        innerEl.addEventListener('mouseenter', () => {
          innerEl.style.transform = 'rotate(-45deg) scale(1.3)';
          innerEl.style.boxShadow = '0 3px 14px rgba(0,0,0,0.5)';
        });

        innerEl.addEventListener('mouseleave', () => {
          innerEl.style.transform = 'rotate(-45deg) scale(1)';
          innerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
        });

        outerEl.appendChild(innerEl);

        const popup = new maplibregl.Popup({ offset: 20, closeButton: true })
          .setHTML(`<h3>${marker.label}</h3><p>${marker.sub}</p>`);

        const mapMarker = new maplibregl.Marker({ 
          element: outerEl,
          anchor: 'bottom'
        })
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
    const activeIndices = chapter.markerIndices;

    // Update active markers styling
    markersRef.current.forEach((marker, i) => {
      const outerEl = marker.getElement();
      const innerEl = outerEl.querySelector('.custom-marker') as HTMLElement;
      if (!innerEl) return;
      
      const isActive = activeIndices.includes(i);
      
      if (isActive) {
        innerEl.classList.add('active-marker');
        innerEl.style.background = theme.colors.accent;
        outerEl.style.width = '22px';
        outerEl.style.height = '22px';
      } else {
        innerEl.classList.remove('active-marker');
        innerEl.style.background = theme.colors.gold;
        outerEl.style.width = '18px';
        outerEl.style.height = '18px';
      }
    });

    // Fly to the new location
    mapRef.current.flyTo({
      center: chapter.center,
      zoom: chapter.zoom,
      pitch: chapter.pitch,
      bearing: chapter.bearing,
      duration: 2800,
      essential: true,
      curve: 1.4,
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
