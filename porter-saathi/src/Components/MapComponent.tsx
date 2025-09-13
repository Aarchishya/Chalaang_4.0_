import React, { useEffect, useRef } from 'react';
import type { Location } from '../services/navigationService';

interface MapComponentProps {
  currentLocation: Location | null;
  destination?: string;
  isVisible: boolean;
  onClose: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  currentLocation, 
  destination, 
  isVisible, 
  onClose 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !currentLocation) return;

    // Simple map display using OpenStreetMap
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.longitude - 0.01},${currentLocation.latitude - 0.01},${currentLocation.longitude + 0.01},${currentLocation.latitude + 0.01}&layer=mapnik&marker=${currentLocation.latitude},${currentLocation.longitude}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.title = 'Navigation Map';

    if (mapRef.current) {
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(iframe);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [currentLocation, isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Map Header */}
      <div style={{
        background: '#1e40af',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Navigation Map</h3>
          {destination && (
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              To: {destination}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Close Map
        </button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        style={{
          flex: 1,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!currentLocation && (
          <div style={{
            color: '#6b7280',
            fontSize: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
            <div>Location not available</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              Enable GPS to view map
            </div>
          </div>
        )}
      </div>

      {/* Map Footer */}
      <div style={{
        background: '#23232a',
        color: '#e0e7ef',
        padding: '12px 24px',
        fontSize: '14px',
        textAlign: 'center',
      }}>
        {currentLocation ? (
          <div>
            📍 {currentLocation.placeName || 'Current Location'}: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            {currentLocation.accuracy && (
              <span style={{ marginLeft: '16px', opacity: 0.7 }}>
                Accuracy: ±{Math.round(currentLocation.accuracy)}m
              </span>
            )}
            {currentLocation.address && (
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                {currentLocation.address}
              </div>
            )}
          </div>
        ) : (
          <div>GPS location not available</div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
