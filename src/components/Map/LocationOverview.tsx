import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { theme } from '../../styles/GlobalStyles';
import { createMarkerElement } from '../../utils/createMarkerElement';

export const LocationOverview: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { markers } = useChapter();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/globe.json', // Official globe style
      center: [15, 30],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      scrollZoom: true,
      dragPan: true,
      touchZoomRotate: true,
      dragRotate: true,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    // MapLibre HTML-markers zijn gewone DOM-elementen en worden altijd gerenderd,
    // ook als ze aan de achterkant van de bol zitten. Deze functie berekent bij
    // elke camerabeweging of een marker op de zichtbare hemisfeer staat via het
    // inwendig product van de eenheidsvectoren van de camerafocus en de marker:
    //
    //   sin(φ_c)·sin(φ_m) + cos(φ_c)·cos(φ_m)·cos(λ_m − λ_c) > 0
    //
    // Positief → marker staat binnen 90° van de kijkrichting → zichtbaar.
    // Negatief of nul → marker zit achter de bol → verborgen.
    const updateMarkerVisibility = () => {
      const center = map.getCenter();
      const cLng = center.lng * (Math.PI / 180);
      const cLat = center.lat * (Math.PI / 180);

      markersRef.current.forEach((mapMarker) => {
        const { lng, lat } = mapMarker.getLngLat();
        const mLng = lng * (Math.PI / 180);
        const mLat = lat * (Math.PI / 180);

        const dot =
          Math.sin(cLat) * Math.sin(mLat) +
          Math.cos(cLat) * Math.cos(mLat) * Math.cos(mLng - cLng);

        mapMarker.getElement().style.visibility = dot > 0 ? 'visible' : 'hidden';
      });
    };

    // Add markers after map loads
    map.on('load', () => {
      markers.forEach((marker) => {
        const { outerEl } = createMarkerElement();

        // Create popup content with marker location
        const popupContent = `<div style="font-weight: 500;">${marker.label}</div><div style="opacity: 0.85; font-style: italic; margin-top: 2px;">${marker.sub}</div>`;

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

      updateMarkerVisibility();
    });

    map.on('move', updateMarkerVisibility);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [markers]);

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
  
  .maplibregl-ctrl-bottom-right {
    bottom: 20px !important;
    right: 20px !important;
  }
  
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
