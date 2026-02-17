// Reference: Hector Plano 58, Bahia Blanca
// Coordinates for Hector Plano 58, Bahia Blanca, Argentina
const STORE_COORDS = { lat: -38.7361644, lon: -62.2874379 };

// Precios (en ARS)
const PRICES = {
    LOCAL_TIER_1: 1500, // <= 2km
    LOCAL_TIER_2: 3500, // > 2km && <= 4km
    LOCAL_TIER_3: 5000, // > 4km (Standard Local)
    NATIONAL: 8500,     // National Shipping
    FREE_THRESHOLD: 5   // Items count for free shipping
};

// Calculate distance in km using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Geocode address using OpenStreetMap Nominatim API
export async function getCoordinates(addressString) {
    try {
        const query = encodeURIComponent(addressString);
        // Nominatim requires a User-Agent
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'AuraVerdeApp/1.0'
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        }
        return null;
    } catch (error) {
        console.error("Error geocoding address:", error);
        return null;
    }
}

/**
 * Calculates shipping cost based on distance or region.
 * @param {string} addressString - Full address (e.g., "Av. Colon 100, Bahia Blanca")
 * @param {number} totalItems - Item count for free shipping check
 */
export async function calculateShippingCost(addressString, totalItems = 0) {
    // 1. Free Shipping Rule
    if (totalItems >= PRICES.FREE_THRESHOLD) {
        return 0;
    }

    if (!addressString) return 0;
    const normalizedAddress = addressString.toLowerCase();

    // 2. Check Region: Is it Bahia Blanca or nearby?
    // We check purely by string matching first to avoid API calls for obviously national shipments
    // IF the string contains "bahia blanca" (or variants), we try to calculate distance.
    const isLocalZone = normalizedAddress.includes('bahia blanca') || 
                        normalizedAddress.includes('bahía blanca') ||
                        normalizedAddress.includes('punta alta') ||
                        normalizedAddress.includes('ingeniero white') ||
                        normalizedAddress.includes('general cerri');

    if (!isLocalZone) {
        return PRICES.NATIONAL;
    }

    // 3. It is Bahia Blanca -> Calculate Distance
    try {
        const coords = await getCoordinates(addressString);
        
        // If we can't find coords, fallback to standard local price (Tier 3)
        if (!coords) {
            console.warn("Could not geocode local address, using standard local price");
            return PRICES.LOCAL_TIER_3;
        }

        const distance = calculateDistance(STORE_COORDS.lat, STORE_COORDS.lon, coords.lat, coords.lon);
        console.log(`Distance to store: ${distance.toFixed(2)} km`);

        if (distance <= 2) {
            return PRICES.LOCAL_TIER_1;
        } else if (distance <= 4) {
            return PRICES.LOCAL_TIER_2;
        } else {
            return PRICES.LOCAL_TIER_3;
        }

    } catch (error) {
        console.error("Error calculating local distance:", error);
        // Fallback on error
        return PRICES.LOCAL_TIER_3;
    }
}
