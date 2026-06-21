import { Place } from '../types';

/**
 * Returns accurate geographic coordinates for typical locations, cities, or national parks in Kenya.
 * Handles both mock objects and dynamically added items by matching keywords.
 */
export function getCoordinates(place: Place): [number, number] {
  // Check if place has direct coordinates
  const p = place as any;
  if (p.lat !== undefined && p.lng !== undefined && !isNaN(parseFloat(p.lat)) && !isNaN(parseFloat(p.lng))) {
    return [parseFloat(p.lat), parseFloat(p.lng)];
  }
  if (p.latitude !== undefined && p.longitude !== undefined && !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude))) {
    return [parseFloat(p.latitude), parseFloat(p.longitude)];
  }

  const nameLower = place.name.toLowerCase();
  const locLower = place.location.toLowerCase();

  // Keyword matching for maximum specificity first
  if (nameLower.includes('maasai mara') || nameLower.includes('mara safari') || locLower.includes('mara')) {
    return [-1.5286, 35.1916];
  }
  if (nameLower.includes('diani') || locLower.includes('diani') || locLower.includes('kwale')) {
    return [-4.2799, 39.5947];
  }
  if (nameLower.includes('carnivore')) {
    return [-1.3256, 36.8051];
  }
  if (nameLower.includes('alchemist')) {
    return [-1.2644, 36.8044]; // Westlands
  }
  if (nameLower.includes('village market')) {
    return [-1.2335, 36.8005]; // Gigiri
  }
  if (nameLower.includes('ngong hills') || locLower.includes('kajiado')) {
    return [-1.4038, 36.6375];
  }
  if (nameLower.includes('savage wilderness') || locLower.includes('sagana')) {
    return [-0.7254, 37.2104];
  }
  if (nameLower.includes('hell\'s gate') || nameLower.includes('naivasha') || locLower.includes('naivasha')) {
    return [-0.8926, 36.3235];
  }
  if (nameLower.includes('mama oliech')) {
    return [-1.2882, 36.7952];
  }

  // City and major area regions
  if (locLower.includes('nairobi') || locLower.includes('westlands') || locLower.includes('gigiri') || locLower.includes('lavington')) {
    // Generate slight offset based on ID or name length to prevent multiple Nairobi items from overlapping exactly
    const offsetHash = (place.name.length % 5) * 0.006 - 0.012;
    const offsetHashY = (place.id.charCodeAt(0) % 5) * 0.006 - 0.012;
    return [-1.2921 + offsetHashY, 36.8219 + offsetHash];
  }
  if (locLower.includes('mombasa') || locLower.includes('coast') || locLower.includes('kilifi') || locLower.includes('lamu') || locLower.includes('watamu')) {
    const offsetHash = (place.name.length % 5) * 0.01 - 0.02;
    return [-4.0435 + offsetHash, 39.6682 - offsetHash];
  }
  if (locLower.includes('kisumu') || locLower.includes('victoria')) {
    return [-0.0917, 34.7680];
  }
  if (locLower.includes('nakuru') || locLower.includes('elements')) {
    return [-0.3031, 36.0800];
  }
  if (locLower.includes('nanyuki') || locLower.includes('laikipia') || locLower.includes('mount kenya') || locLower.includes('meru')) {
    return [0.0160, 37.0734];
  }
  if (locLower.includes('tsavo') || locLower.includes('vois')) {
    return [-3.0000, 38.5000];
  }
  if (locLower.includes('amboseli')) {
    return [-2.6349, 37.2023];
  }

  // Country center fallback with dynamic hash offset based on ID/name
  const charCodeSum = place.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = ((charCodeSum % 10) - 5) * 0.15;
  const lngOffset = (((charCodeSum + 42) % 10) - 5) * 0.15;
  return [-1.2921 + latOffset, 36.8219 + lngOffset];
}
