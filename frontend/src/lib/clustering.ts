import { Location } from '@/types';

export interface LocationCluster {
    id: string;
    locations: Location[];
    center: { x: number; y: number };
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

interface ClusterOptions {
    radius: number; // Pixel radius for clustering
    minClusterSize: number; // Minimum locations to form a cluster
}

// Bay Area bounds for pixel conversion
const BAY_AREA_BOUNDS = {
    north: 37.9,
    south: 37.4,
    east: -122.0,
    west: -122.7,
};

// Convert lat/lng to pixel coordinates
function getPixelPosition(lat: number, lng: number) {
    const x = ((lng - BAY_AREA_BOUNDS.west) / (BAY_AREA_BOUNDS.east - BAY_AREA_BOUNDS.west)) * 100;
    const y = ((BAY_AREA_BOUNDS.north - lat) / (BAY_AREA_BOUNDS.north - BAY_AREA_BOUNDS.south)) * 100;
    return {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
    };
}

// Calculate distance between two pixel positions
function getPixelDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

// Create clusters from locations
export function clusterLocations(
    locations: Location[],
    options: ClusterOptions = { radius: 8, minClusterSize: 2 }
): LocationCluster[] {
    const { radius, minClusterSize } = options;
    const clusters: LocationCluster[] = [];
    const processedLocations = new Set<string>();

    // Convert all locations to pixel coordinates
    const locationPixels = locations.map(location => ({
        location,
        pixel: getPixelPosition(location.latitude, location.longitude)
    }));

    locationPixels.forEach(({ location, pixel }) => {
        if (processedLocations.has(location.id)) return;

        // Find nearby locations
        const nearbyLocations = locationPixels.filter(({ location: otherLocation, pixel: otherPixel }) => {
            if (processedLocations.has(otherLocation.id)) return false;
            if (location.id === otherLocation.id) return true;

            const distance = getPixelDistance(pixel, otherPixel);
            return distance <= radius;
        });

        // Create cluster if we have enough locations
        if (nearbyLocations.length >= minClusterSize) {
            const clusterLocations = nearbyLocations.map(({ location }) => location);

            // Calculate cluster center
            const centerX = nearbyLocations.reduce((sum, { pixel }) => sum + pixel.x, 0) / nearbyLocations.length;
            const centerY = nearbyLocations.reduce((sum, { pixel }) => sum + pixel.y, 0) / nearbyLocations.length;

            // Calculate bounds
            const lats = clusterLocations.map(loc => loc.latitude);
            const lngs = clusterLocations.map(loc => loc.longitude);

            const bounds = {
                north: Math.max(...lats),
                south: Math.min(...lats),
                east: Math.max(...lngs),
                west: Math.min(...lngs),
            };

            clusters.push({
                id: `cluster-${location.id}`,
                locations: clusterLocations,
                center: { x: centerX, y: centerY },
                bounds
            });

            // Mark all locations as processed
            clusterLocations.forEach(loc => processedLocations.add(loc.id));
        } else {
            // Single location cluster
            clusters.push({
                id: `single-${location.id}`,
                locations: [location],
                center: pixel,
                bounds: {
                    north: location.latitude,
                    south: location.latitude,
                    east: location.longitude,
                    west: location.longitude,
                }
            });

            processedLocations.add(location.id);
        }
    });

    return clusters;
}

// Get cluster zoom level based on cluster size
export function getClusterZoom(clusterSize: number): 'sm' | 'md' | 'lg' {
    if (clusterSize >= 10) return 'lg';
    if (clusterSize >= 5) return 'md';
    return 'sm';
} 