import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place } from '../types';
import { getCoordinates } from '../utils/geocoder';
import { MapPin, ZoomIn, ZoomOut, Navigation, Crosshair, Sparkles } from 'lucide-react';

interface DestinationMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceClick: (place: Place) => void;
  activeCategory?: string;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({
  places,
  selectedPlace,
  onPlaceClick,
  activeCategory
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.FeatureGroup | null>(null);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Nairobi/Kenya Center
    const initialCenter: [number, number] = [-1.2921, 36.8219];
    const initialZoom = 7;

    // Create the map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // We'll build custom premium controls
      attributionControl: true,
      maxBounds: L.latLngBounds(L.latLng(-5.5, 33.5), L.latLng(4.5, 42.0)), // Frame within East Africa
      minZoom: 6,
      maxZoom: 17
    }).setView(initialCenter, initialZoom);

    // Beautiful CartoDB Positron theme: high-contrast minimal off-white styling
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create markers layer
    const markersLayer = L.featureGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    setIsMapReady(true);

    // Track zoom levels
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Listen to window resizing to invalidateLeaflet boundaries
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    // Trigger once initially after rendering mount
    const timer = setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isMapReady]);

  // Update Markers when Places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !isMapReady) return;

    // Clear existing markers
    markersLayer.clearLayers();

    if (places.length === 0) return;

    // Add markers for each place
    places.forEach((place) => {
      const coords = getCoordinates(place);
      
      // Determine colors based on category
      let badgeColor = '#0D1B2A'; // Navy primary
      let hoverBorder = '#E8621A'; // Safari orange
      
      switch (place.category) {
        case 'SAFARI':
          badgeColor = '#D97706'; // Amber-600
          break;
        case 'RESTAURANT':
          badgeColor = '#E11D48'; // Rose-600
          break;
        case 'ENTERTAINMENT':
          badgeColor = '#7C3AED'; // Violet-600
          break;
        case 'OUTDOORS':
        case 'ADVENTURES':
          badgeColor = '#059669'; // Emerald-600
          break;
        case 'HANGOUT_SPOTS':
          badgeColor = '#0284C7'; // Sky-600
          break;
        case 'HOTEL':
          badgeColor = '#2563EB'; // Blue-600
          break;
        default:
          badgeColor = '#E8621A'; // Safari default
      }

      // Beautiful customized HTML pin with pulsating background and clear label on hover
      const customIcon = L.divIcon({
        html: `
          <div class="relative group flex items-center justify-center" style="width: 32px; height: 32px;">
            <!-- Pulsating Ring for verified or trending spots -->
            ${place.isTrending || place.isVerified ? `
              <div class="absolute inset-0 rounded-full animate-ping opacity-25" style="background-color: ${badgeColor};"></div>
            ` : ''}
            
            <!-- Pin Outer -->
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-125 select-none relative z-10" 
                 style="background-color: ${badgeColor};">
              <!-- Inline Icon SVG representing category -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-white">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="1"/>
              </svg>
            </div>

            <!-- Custom Elegant Tooltip label matching the aesthetic layout -->
            <div class="absolute bottom-10 left-1/2 -translate-x-1/2 bg-navy text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
              <div class="flex items-center gap-1.5">
                <span>${place.name}</span>
                <span class="text-safari font-bold">★ ${place.rating.toFixed(1)}</span>
              </div>
              <div class="text-[7px] text-white/50 tracking-wider text-center mt-0.5">${place.location}</div>
            </div>
          </div>
        `,
        className: 'pk-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(coords, { icon: customIcon });

      // Create Custom Leaflet Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans rounded-xl overflow-hidden text-navy border-none max-w-[280px]';
      popupContent.innerHTML = `
        <div class="relative rounded-lg overflow-hidden h-28 w-full mb-3 bg-navy/5">
          <img src="${place.imageUrl}" class="w-full h-full object-cover" alt="${place.name}" />
          <span class="absolute top-2 left-2 bg-white/95 text-navy font-black text-[8px] uppercase tracking-widest px-2.5 h-5 rounded-full flex items-center justify-center shadow-sm">
            ${place.category.replace('_', ' ')}
          </span>
          ${place.isVerified ? `
            <span class="absolute top-2 right-2 bg-safari text-white font-black text-[8px] uppercase tracking-widest px-2.5 h-5 rounded-full flex items-center justify-center shadow-sm">
              Verified
            </span>
          ` : ''}
        </div>
        <div class="space-y-1">
          <div class="flex justify-between items-start gap-2">
            <h4 class="font-serif font-black text-sm text-navy leading-snug">${place.name}</h4>
            <div class="flex items-center gap-0.5 shrink-0 bg-navy/5 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <span class="text-amber-500">★</span> ${place.rating.toFixed(1)}
            </div>
          </div>
          <p class="text-[10px] text-navy/40 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safari shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${place.location}
          </p>
          <p class="text-[10.5px] text-navy/70 line-clamp-2 mt-1.5 leading-relaxed">${place.description}</p>
          
          <div class="flex items-center justify-between pt-3 mt-3 border-t border-navy/5">
            <span class="text-[10px] font-black uppercase tracking-wider text-navy/35">
              ${place.price && place.price > 0 ? `From Ksh ${place.price.toLocaleString()}` : 'Free Access'}
            </span>
            <button id="popup-explore-btn-${place.id}" class="h-7 px-3 bg-navy hover:bg-safari text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 shadow-sm">
              Curate <span class="font-sans">→</span>
            </button>
          </div>
        </div>
      `;

      // Set up click delegate on explore button in popup
      marker.bindPopup(popupContent, {
        closeButton: false,
        maxWidth: 280,
        className: 'pk-popup'
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-explore-btn-${place.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            onPlaceClick(place);
            marker.closePopup();
          });
        }
      });

      markersLayer.addLayer(marker);
    });

    // Fit map bounds gracefully if multiple points exist, otherwise center smoothly
    if (places.length > 1) {
      map.fitBounds(markersLayer.getBounds(), {
        padding: [40, 40],
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    } else if (places.length === 1) {
      const singleCoords = getCoordinates(places[0]);
      map.setView(singleCoords, 11, {
        animate: true,
        duration: 0.8
      });
    }
  }, [places, isMapReady]);

  // Smooth fly to when a place is externally selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !isMapReady || !selectedPlace) return;

    const coords = getCoordinates(selectedPlace);
    
    // Zoom in on the point
    map.setView(coords, 12, {
      animate: true,
      duration: 1.0
    });

    // Find and open associated popup
    markersLayer.eachLayer((layer: any) => {
      const latLng = layer.getLatLng();
      if (latLng && latLng.lat === coords[0] && latLng.lng === coords[1]) {
        setTimeout(() => {
          layer.openPopup();
        }, 800);
      }
    });
  }, [selectedPlace, isMapReady]);

  // Map Controls Helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterKenya = () => {
    mapInstanceRef.current?.setView([-1.2921, 36.8219], 7, {
      animate: true,
      duration: 1.0
    });
  };

  const handleQuickRegion = (region: 'nairobi' | 'coast' | 'rift') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (region === 'nairobi') {
      map.setView([-1.2921, 36.8219], 11, { animate: true, duration: 1.0 });
    } else if (region === 'coast') {
      map.setView([-4.0435, 39.6682], 10, { animate: true, duration: 1.0 });
    } else if (region === 'rift') {
      map.setView([-0.8926, 36.3235], 9, { animate: true, duration: 1.0 });
    }
  };

  return (
    <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-lux group flex flex-col">
      {/* Map Element */}
      <div id="interactive-destination-map" ref={mapContainerRef} className="w-full flex-1 relative z-0" style={{ minHeight: '350px' }} />

      {/* Embedded High-End Custom Controls Panel */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-1.5">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white hover:bg-navy text-navy hover:text-white rounded-xl shadow-lux flex items-center justify-center transition-all cursor-pointer border border-navy/5"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white hover:bg-navy text-navy hover:text-white rounded-xl shadow-lux flex items-center justify-center transition-all cursor-pointer border border-navy/5"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          onClick={handleCenterKenya}
          className="w-10 h-10 bg-white hover:bg-safari text-navy hover:text-white rounded-xl shadow-lux flex items-center justify-center transition-all cursor-pointer border border-navy/5 mt-2"
          title="Zoom to Entire Kenya"
        >
          <Crosshair size={16} />
        </button>
      </div>

      {/* Floating Regions Guide Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] bg-navy/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl transition-all duration-300 md:flex items-center justify-between gap-4 hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <Navigation size={12} className="text-safari rotate-45" />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-safari leading-none">Aesthetic Compass</div>
            <div className="text-[10px] font-medium text-white/60 mt-0.5">Quickly pilot your adventure coordinates</div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button 
            onClick={() => handleQuickRegion('nairobi')}
            className="px-3.5 h-8 bg-white/5 hover:bg-white text-white hover:text-navy text-[8px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border border-white/5"
          >
            Nairobi
          </button>
          <button 
            onClick={() => handleQuickRegion('coast')}
            className="px-3.5 h-8 bg-white/5 hover:bg-white text-white hover:text-navy text-[8px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border border-white/5"
          >
            Coastline
          </button>
          <button 
            onClick={() => handleQuickRegion('rift')}
            className="px-3.5 h-8 bg-white/5 hover:bg-white text-white hover:text-navy text-[8px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border border-white/5"
          >
            Rift Valley
          </button>
        </div>
      </div>

      {/* Leaflet Custom Style Overrides Injection to avoid popup mismatch with dark branding */}
      <style>{`
        .pk-popup .leaflet-popup-content-wrapper {
          background-color: #FAFAF8 !important;
          border-radius: 1rem !important;
          padding: 6px !important;
          box-shadow: 0 25px 50px -12px rgba(13, 27, 42, 0.25) !important;
          border: 1px solid rgba(13, 27, 42, 0.05) !important;
        }
        .pk-popup .leaflet-popup-tip {
          background-color: #FAFAF8 !important;
        }
        .leaflet-container {
          font-family: 'Josefin Sans', sans-serif !important;
        }
      `}</style>
    </div>
  );
};
