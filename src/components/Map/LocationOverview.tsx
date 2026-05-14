import React, { useEffect, useRef, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { theme } from '../../styles/GlobalStyles';

export const LocationOverview: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { chapters, markers } = useChapter();

  // Create a mapping from marker index to location tags
  const markerToLocationTags = useMemo(() => {
    const mapping: Map<number, string[]> = new Map();
    
    chapters.forEach(chapter => {
      chapter.markerIndices.forEach(markerIdx => {
        if (!mapping.has(markerIdx)) {
          mapping.set(markerIdx, []);
        }
        mapping.get(markerIdx)!.push(chapter.locationTag);
      });
    });
    
    return mapping;
  }, [chapters]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [15, 30],
      zoom: 2,
      pitch: 0,
      bearing: 0,
      scrollZoom: true,
      dragPan: true,
      touchZoomRotate: true,
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

        // Inner element - our styling
        const innerEl = document.createElement('div');
        innerEl.className = 'custom-marker';

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

        // Get location tags for this marker
        const locationTags = markerToLocationTags.get(i) || [];
        const uniqueTags = Array.from(new Set(locationTags));
        
        // Create popup content with location tag(s)
        const popupContent = uniqueTags.length > 0 
          ? uniqueTags.map(tag => `<div style="margin: 4px 0;">${tag}</div>`).join('')
          : `<div>${marker.label}<br/>${marker.sub}</div>`;

        const popup = new maplibregl.Popup({ 
          offset: 20, 
          closeButton: false,
          className: 'location-popup'
        }).setHTML(popupContent);

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
  }, [chapters, markers, markerToLocationTags]);

  return (
    <Container>
      <Header>
        <Title>Overzicht locaties</Title>
        <Subtitle>Alle bezochte locaties op de wereldkaart — hover over een marker voor details</Subtitle>
      </Header>
      <MapContainer>
        <MapDiv ref={mapContainerRef} />
      </MapContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.navy};
`;

const Header = styled.div`
  padding: 2rem 3rem;
  background: linear-gradient(135deg, ${theme.colors.navy} 0%, ${theme.colors.navyDark} 100%);
  border-bottom: 1px solid ${theme.colors.gold}33;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  color: ${theme.colors.cream};
  margin: 0 0 0.5rem 0;
  font-weight: 300;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.gold};
  margin: 0;
  opacity: 0.9;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
  
  .maplibregl-popup-content {
    background: ${theme.colors.navy};
    color: ${theme.colors.cream};
    border: 1px solid ${theme.colors.gold};
    border-radius: 8px;
    padding: 12px 16px;
    font-family: ${theme.fonts.body};
    font-size: 0.95rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    
    div {
      color: ${theme.colors.gold};
      line-height: 1.4;
    }
  }
  
  .maplibregl-popup-tip {
    border-top-color: ${theme.colors.gold};
  }
`;
