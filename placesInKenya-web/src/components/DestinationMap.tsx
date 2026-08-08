import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place } from '../types';
import { getCoordinates } from '../utils/geocoder';
import { MapPin, ZoomIn, ZoomOut, Navigation, Crosshair, Sparkles, Locate, RefreshCw, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface DestinationMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceClick: (place: Place) => void;
  activeCategory?: string;
}

// Haversine formula to compute geographic distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
  const userLayerRef = useRef<L.FeatureGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState(7);
  const [isMapReady, setIsMapReady] = useState(false);

  // Geolocation & 20km Filter States
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [nearbyCount, setNearbyCount] = useState<number | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Nairobi/Kenya Center
    const initialCenter: [number, number] = [-1.2921, 36.8219];
    const initialZoom = 7;

    // Create the map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // Custom premium controls
      attributionControl: true,
      maxBounds: L.latLngBounds(L.latLng(-5.5, 33.5), L.latLng(4.5, 42.0)), // Frame within East Africa
      minZoom: 6,
      maxZoom: 17
    }).setView(initialCenter, initialZoom);

    // CartoDB Positron theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create layers
    const markersLayer = L.featureGroup().addTo(map);
    const userLayer = L.featureGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    userLayerRef.current = userLayer;
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

  // Listen to window resizing
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isMapReady]);

  // Handle Geolocation Request ("Near My Location")
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const newLocation = { lat: userLat, lng: userLng };

        setUserLocation(newLocation);
        setIsNearMeActive(true);
        setIsLocating(false);

        // Center map on user location
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([userLat, userLng], 12, { animate: true, duration: 1.0 });
        }
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location access was denied. Please allow location permissions in your browser.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Your location position is currently unavailable.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Could not retrieve your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleClearLocationFilter = () => {
    setIsNearMeActive(false);
    setUserLocation(null);
    setLocationError(null);
    setNearbyCount(null);

    if (userLayerRef.current) {
      userLayerRef.current.clearLayers();
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-1.2921, 36.8219], 7, { animate: true, duration: 1.0 });
    }
  };

  // Render User Location Pin & 20km Radius Circle on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userLayer = userLayerRef.current;
    if (!map || !userLayer || !isMapReady) return;

    userLayer.clearLayers();

    if (isNearMeActive && userLocation) {
      const { lat, lng } = userLocation;

      // 1. Draw 20km Geographic Circle
      const circle20km = L.circle([lat, lng], {
        radius: 20000, // 20km in meters
        color: '#E8621A',
        fillColor: '#E8621A',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6, 6'
      });
      userLayer.addLayer(circle20km);

      // 2. Draw Pulsing User Position Pin
      const userIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center select-none" style="width: 44px; height: 44px;">
            <div class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-35"></div>
            <div class="w-10 h-10 rounded-full bg-navy border-2 border-white shadow-2xl flex items-center justify-center relative z-10 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E8621A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="3" fill="#E8621A"/>
              </svg>
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
              You Are Here
            </div>
          </div>
        `,
        className: 'pk-user-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const userMarker = L.marker([lat, lng], { icon: userIcon });
      userLayer.addLayer(userMarker);
    }
  }, [userLocation, isNearMeActive, isMapReady]);

  // Update Markers when Places or Location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !isMapReady) return;

    // Clear existing place markers
    markersLayer.clearLayers();

    if (places.length === 0) {
      setNearbyCount(0);
      return;
    }

    // Filter places if Near Me filter is active
    let displayPlaces = places;
    if (isNearMeActive && userLocation) {
      displayPlaces = places.filter((place) => {
        const coords = getCoordinates(place);
        const distKm = getDistanceKm(userLocation.lat, userLocation.lng, coords[0], coords[1]);
        return distKm <= 20; // 20km radius threshold
      });
      setNearbyCount(displayPlaces.length);
    } else {
      setNearbyCount(null);
    }

    // If 0 places within 20km, show option to display nearest places
    const placesToRender = (isNearMeActive && userLocation && displayPlaces.length === 0) ? places : displayPlaces;

    // Add markers for each place
    placesToRender.forEach((place) => {
      const coords = getCoordinates(place);
      const distFromUser = userLocation ? getDistanceKm(userLocation.lat, userLocation.lng, coords[0], coords[1]) : null;
      
      // Category colors
      let badgeColor = '#0D1B2A';
      switch (place.category) {
        case 'SAFARI': badgeColor = '#D97706'; break;
        case 'RESTAURANT': badgeColor = '#E11D48'; break;
        case 'ENTERTAINMENT': badgeColor = '#7C3AED'; break;
        case 'OUTDOORS':
        case 'ADVENTURES': badgeColor = '#059669'; break;
        case 'HANGOUT_SPOTS': badgeColor = '#0284C7'; break;
        case 'HOTEL': badgeColor = '#2563EB'; break;
        case 'SHOPPING': badgeColor = '#0D9488'; break;
        default: badgeColor = '#E8621A';
      }

      const customIcon = L.divIcon({
        html: `
          <div class="relative group flex items-center justify-center cursor-pointer" style="width: 36px; height: 36px;">
            ${place.isTrending || place.isVerified ? `
              <div class="absolute inset-0 rounded-full animate-ping opacity-30" style="background-color: ${badgeColor};"></div>
            ` : ''}
            
            <div class="w-9 h-9 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-125 select-none relative z-10" 
                 style="background-color: ${badgeColor};">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>

            <!-- Rich Hover Preview Card with Distance -->
            <div class="absolute bottom-11 left-1/2 -translate-x-1/2 bg-navy/95 backdrop-blur-md text-white rounded-2xl p-2.5 shadow-2xl border border-white/15 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-30 w-52 text-left">
              ${place.imageUrl ? `
                <div class="w-full h-20 rounded-xl overflow-hidden mb-2 bg-white/10 relative">
                  <img src="${place.imageUrl}" alt="${place.name}" class="w-full h-full object-cover" />
                  <span class="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white font-bold text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                    ${place.category.replace('_', ' ')}
                  </span>
                  ${distFromUser !== null ? `
                    <span class="absolute top-1.5 right-1.5 bg-safari text-white font-black text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-full">
                      ${distFromUser.toFixed(1)} km
                    </span>
                  ` : ''}
                </div>
              ` : ''}
              <div class="font-serif font-bold text-xs text-white leading-tight truncate">${place.name}</div>
              <div class="flex items-center justify-between text-[9px] text-white/70 mt-1">
                <span class="truncate max-w-[120px] text-white/60">📍 ${place.location}</span>
                <span class="text-amber-400 font-bold shrink-0">★ ${place.rating.toFixed(1)}</span>
              </div>
              <div class="text-[9px] font-black uppercase text-safari mt-1.5 pt-1 border-t border-white/10 flex justify-between items-center">
                <span>${place.price && place.price > 0 ? `Ksh ${place.price.toLocaleString()}` : 'Free Access'}</span>
                <span class="text-[8px] text-white/40">Click for details →</span>
              </div>
            </div>
          </div>
        `,
        className: 'pk-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(coords, { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans rounded-xl overflow-hidden text-navy border-none max-w-[280px]';
      popupContent.innerHTML = `
        <div class="relative rounded-lg overflow-hidden h-28 w-full mb-3 bg-navy/5">
          <img src="${place.imageUrl}" class="w-full h-full object-cover" alt="${place.name}" />
          <span class="absolute top-2 left-2 bg-white/95 text-navy font-black text-[8px] uppercase tracking-widest px-2.5 h-5 rounded-full flex items-center justify-center shadow-sm">
            ${place.category.replace('_', ' ')}
          </span>
          ${distFromUser !== null ? `
            <span class="absolute top-2 right-2 bg-safari text-white font-black text-[8px] uppercase tracking-widest px-2.5 h-5 rounded-full flex items-center justify-center shadow-sm">
              📍 ${distFromUser.toFixed(1)} km away
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

    // Fit bounds if near me or multiple points
    if (isNearMeActive && userLocation) {
      // Keep view centered around 20km circle/user location
      map.setView([userLocation.lat, userLocation.lng], 11, { animate: true, duration: 0.8 });
    } else if (places.length > 1) {
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
  }, [places, isMapReady, isNearMeActive, userLocation]);

  // Smooth fly to when a place is externally selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !isMapReady || !selectedPlace) return;

    const coords = getCoordinates(selectedPlace);
    
    map.setView(coords, 12, {
      animate: true,
      duration: 1.0
    });

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
  const handleZoomIn = () => { mapInstanceRef.current?.zoomIn(); };
  const handleZoomOut = () => { mapInstanceRef.current?.zoomOut(); };
  const handleCenterKenya = () => {
    setIsNearMeActive(false);
    mapInstanceRef.current?.setView([-1.2921, 36.8219], 7, { animate: true, duration: 1.0 });
  };

  const handleQuickRegion = (region: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    switch (region) {
      case 'nairobi': map.setView([-1.2921, 36.8219], 11, { animate: true, duration: 1.0 }); break;
      case 'coast': map.setView([-4.0435, 39.6682], 10, { animate: true, duration: 1.0 }); break;
      case 'rift': map.setView([-0.8926, 36.3235], 9, { animate: true, duration: 1.0 }); break;
      case 'mtkenya': map.setView([-0.1522, 37.3084], 9.5, { animate: true, duration: 1.0 }); break;
      case 'mara': map.setView([-1.4061, 35.1118], 10.5, { animate: true, duration: 1.0 }); break;
      case 'amboseli': map.setView([-2.6527, 37.2606], 10, { animate: true, duration: 1.0 }); break;
      case 'northern': map.setView([0.5682, 37.5833], 9, { animate: true, duration: 1.0 }); break;
      case 'western': map.setView([-0.1022, 34.7617], 10, { animate: true, duration: 1.0 }); break;
      default: map.setView([-1.2921, 36.8219], 7, { animate: true, duration: 1.0 });
    }
  };

  const REGIONS = [
    { id: 'nairobi', label: 'Nairobi' },
    { id: 'coast', label: 'Coastline' },
    { id: 'rift', label: 'Rift Valley' },
    { id: 'mtkenya', label: 'Mt. Kenya' },
    { id: 'mara', label: 'Maasai Mara' },
    { id: 'amboseli', label: 'Amboseli' },
    { id: 'northern', label: 'Northern Kenya' },
    { id: 'western', label: 'Western Kenya' },
  ];

  return (
    <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-lux group flex flex-col">
      {/* Map Element */}
      <div id="interactive-destination-map" ref={mapContainerRef} className="w-full flex-1 relative z-0" style={{ minHeight: '350px' }} />

      {/* Embedded High-End Custom Controls Panel (Left Side) */}
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
        <button 
          onClick={handleNearMe}
          disabled={isLocating}
          className={`w-10 h-10 rounded-xl shadow-lux flex items-center justify-center transition-all cursor-pointer border ${
            isNearMeActive 
              ? 'bg-safari text-white border-safari' 
              : 'bg-white hover:bg-safari text-navy hover:text-white border-navy/5'
          }`}
          title="Near My Location (20km)"
        >
          <Locate size={18} className={isLocating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Top Right Action Overlay: Prominent 'Near My Location' Pill Button */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        <button
          onClick={isNearMeActive ? handleClearLocationFilter : handleNearMe}
          disabled={isLocating}
          className={`h-10 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all cursor-pointer border backdrop-blur-md ${
            isNearMeActive
              ? 'bg-safari text-white border-safari hover:bg-safari-dark'
              : 'bg-navy/90 hover:bg-navy text-white border-white/20'
          }`}
        >
          <Locate size={15} className={isLocating ? 'animate-spin text-safari' : isNearMeActive ? 'text-white' : 'text-safari'} />
          <span>{isLocating ? 'Locating...' : isNearMeActive ? 'Near Me (20km Active)' : 'Near My Location'}</span>
          {isNearMeActive && (
            <X size={14} className="ml-1 opacity-70 hover:opacity-100" />
          )}
        </button>

        {/* Nearby Count Notification Banner */}
        {isNearMeActive && (
          <div className="bg-navy/95 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>
              {nearbyCount !== null && nearbyCount > 0
                ? `${nearbyCount} place${nearbyCount === 1 ? '' : 's'} within 20km`
                : 'No places within 20km. Displaying all Kenyan spots.'}
            </span>
          </div>
        )}

        {/* Location Permission / Error Toast */}
        {locationError && (
          <div className="bg-red-950/90 border border-red-500/40 text-red-200 text-[10px] font-bold p-3 rounded-xl shadow-2xl max-w-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span>{locationError}</span>
            </div>
            <button onClick={() => setLocationError(null)} className="text-red-300 hover:text-white p-0.5">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Floating Regions Guide Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] bg-navy/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Navigation size={12} className="text-safari rotate-45" />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-safari leading-none">Regions</div>
            <div className="text-[9px] font-medium text-white/50 hidden sm:block">Pilot coordinates</div>
          </div>
        </div>

        {/* Scrollable region options container */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap py-0.5 px-0.5 max-w-full">
          {REGIONS.map((r) => (
            <button 
              key={r.id}
              onClick={() => handleQuickRegion(r.id)}
              className="px-3 h-7 bg-white/10 hover:bg-safari text-white hover:text-white text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer border border-white/10 shrink-0 active:scale-95"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Custom Style Overrides Injection */}
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

