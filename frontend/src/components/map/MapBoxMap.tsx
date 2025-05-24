'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, Popup, Source, Layer, MapLayerMouseEvent } from 'react-map-gl';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { Location, LocationCategory } from '@/types';
import { MapBoxMarker } from './MapBoxMarker';
import { LocationPopup } from './LocationPopup';
import { CategoryFilter } from './CategoryFilter';
import { AddLocationMarker } from './AddLocationMarker';
import { useAuth } from '@/hooks/useAuth';

interface MapBoxMapProps {
    locations: Location[];
    onLocationClick?: (location: Location) => void;
    selectedLocation?: Location | null;
    onAddLocation?: (lat: number, lng: number) => void;
}

// Bay Area bounds to keep users focused on the region
const BAY_AREA_BOUNDS: [number, number, number, number] = [
    -123.1, 37.0, // Southwest coordinates
    -121.5, 38.5  // Northeast coordinates
];

// Bay Area center coordinates
const BAY_AREA_CENTER: [number, number] = [-122.4194, 37.7749];

export function MapBoxMap({
    locations,
    onLocationClick,
    selectedLocation,
    onAddLocation
}: MapBoxMapProps) {
    const { isAuthenticated } = useAuth();
    const mapRef = useRef<MapRef>(null);

    // Map state
    const [viewState, setViewState] = useState({
        longitude: BAY_AREA_CENTER[0],
        latitude: BAY_AREA_CENTER[1],
        zoom: 9.5,
        pitch: 45, // 3D effect for Bay Area terrain
        bearing: 0
    });

    // UI state
    const [popupInfo, setPopupInfo] = useState<Location | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<Set<LocationCategory>>(new Set());
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [newLocationCoords, setNewLocationCoords] = useState<[number, number] | null>(null);
    const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

    // Filter locations based on selected categories
    const visibleLocations = locations.filter(location =>
        filteredCategories.size === 0 || filteredCategories.has(location.category as LocationCategory)
    );

    // MapBox access token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // Handle category filter changes
    const handleCategoryToggle = useCallback((category: LocationCategory) => {
        setFilteredCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    }, []);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        setFilteredCategories(new Set());
    }, []);

    // Handle marker click
    const handleMarkerClick = useCallback((location: Location) => {
        setPopupInfo(location);
        onLocationClick?.(location);

        // Smooth fly to location
        mapRef.current?.flyTo({
            center: [location.longitude, location.latitude],
            zoom: 14,
            duration: 1000
        });
    }, [onLocationClick]);

    // Handle map click for adding new locations
    const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
        if (isAddingLocation && isAuthenticated) {
            const { lng, lat } = event.lngLat;
            setNewLocationCoords([lng, lat]);
            onAddLocation?.(lat, lng);
            setIsAddingLocation(false);
        }
    }, [isAddingLocation, isAuthenticated, onAddLocation]);

    // Effect to handle selected location changes
    useEffect(() => {
        if (selectedLocation) {
            setPopupInfo(selectedLocation);
            mapRef.current?.flyTo({
                center: [selectedLocation.longitude, selectedLocation.latitude],
                zoom: 14,
                duration: 1000
            });
        }
    }, [selectedLocation]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setPopupInfo(null);
                setIsAddingLocation(false);
                setNewLocationCoords(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!mapboxToken) {
        return (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-600">MapBox access token not configured</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 rounded-lg overflow-hidden border shadow-lg">
            {/* Category Filter Controls */}
            <div className="absolute top-4 left-4 z-10">
                <CategoryFilter
                    locations={locations}
                    filteredCategories={filteredCategories}
                    onCategoryToggle={handleCategoryToggle}
                    onClearFilters={handleClearFilters}
                />
            </div>

            {/* Add Location Toggle (Authenticated users only) */}
            {isAuthenticated && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setIsAddingLocation(!isAddingLocation)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isAddingLocation
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            } shadow-lg backdrop-blur-sm`}
                    >
                        {isAddingLocation ? 'Cancel' : 'Add Location'}
                    </button>
                </div>
            )}

            {/* Instructions for adding location */}
            {isAddingLocation && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border">
                    <p className="text-sm text-gray-700">Click on the map to add a new location</p>
                </div>
            )}

            {/* MapBox Map */}
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                onClick={handleMapClick}
                mapboxAccessToken={mapboxToken}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                maxBounds={BAY_AREA_BOUNDS}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.2 }}
                cursor={isAddingLocation ? 'crosshair' : 'grab'}
            >
                {/* 3D Terrain Source */}
                <Source
                    id="mapbox-dem"
                    type="raster-dem"
                    url="mapbox://mapbox.terrain-dem-v1"
                    tileSize={512}
                    maxzoom={14}
                />

                {/* Location Markers */}
                {visibleLocations.map((location) => (
                    <Marker
                        key={location.id}
                        longitude={location.longitude}
                        latitude={location.latitude}
                        anchor="bottom"
                    >
                        <MapBoxMarker
                            location={location}
                            isSelected={selectedLocation?.id === location.id}
                            isHovered={hoveredMarkerId === location.id}
                            onClick={() => handleMarkerClick(location)}
                            onMouseEnter={() => setHoveredMarkerId(location.id)}
                            onMouseLeave={() => setHoveredMarkerId(null)}
                        />
                    </Marker>
                ))}

                {/* New Location Marker */}
                {newLocationCoords && (
                    <Marker
                        longitude={newLocationCoords[0]}
                        latitude={newLocationCoords[1]}
                        anchor="bottom"
                    >
                        <AddLocationMarker />
                    </Marker>
                )}

                {/* Location Popup */}
                {popupInfo && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        anchor="top"
                        onClose={() => setPopupInfo(null)}
                        closeButton={true}
                        closeOnClick={false}
                        className="mapbox-popup"
                    >
                        <LocationPopup
                            location={popupInfo}
                            onClose={() => setPopupInfo(null)}
                        />
                    </Popup>
                )}
            </Map>

            {/* Map Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border text-xs">
                <div className="space-y-1">
                    <div className="font-semibold text-gray-800">Bay Area Guide</div>
                    <div className="text-gray-600">{visibleLocations.length} locations</div>
                    {filteredCategories.size > 0 && (
                        <div className="text-blue-600">
                            {filteredCategories.size} filter{filteredCategories.size !== 1 ? 's' : ''} active
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 