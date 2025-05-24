'use client';

import { useState } from 'react';
import { Location } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

interface SimpleMapProps {
    locations: Location[];
    onLocationClick?: (location: Location) => void;
    selectedLocation?: Location | null;
}

export function SimpleMap({ locations, onLocationClick, selectedLocation }: SimpleMapProps) {
    const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);

    // Bay Area bounds for the simple map
    const bayAreaBounds = {
        north: 37.9,
        south: 37.4,
        east: -122.0,
        west: -122.7,
    };

    // Convert lat/lng to pixel coordinates for our simple map
    const getPixelPosition = (lat: number, lng: number) => {
        const x = ((lng - bayAreaBounds.west) / (bayAreaBounds.east - bayAreaBounds.west)) * 100;
        const y = ((bayAreaBounds.north - lat) / (bayAreaBounds.north - bayAreaBounds.south)) * 100;
        return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            restaurant: 'bg-red-500',
            cafe: 'bg-orange-500',
            bar: 'bg-purple-500',
            shopping: 'bg-blue-500',
            park: 'bg-green-500',
            hike: 'bg-emerald-500',
            museum: 'bg-indigo-500',
            entertainment: 'bg-pink-500',
            beach: 'bg-cyan-500',
            viewpoint: 'bg-yellow-500',
            other: 'bg-gray-500',
        };
        return colors[category] || colors.other;
    };

    return (
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border overflow-hidden">
            {/* Simple map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
                {/* Bay Area outline placeholder */}
                <div className="absolute inset-4 border-2 border-blue-200 rounded-lg opacity-30" />

                {/* Location markers */}
                {locations.map((location) => {
                    const position = getPixelPosition(location.latitude, location.longitude);
                    const isSelected = selectedLocation?.id === location.id;
                    const isHovered = hoveredLocation?.id === location.id;

                    return (
                        <div
                            key={location.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                zIndex: isSelected || isHovered ? 20 : 10,
                            }}
                            onClick={() => onLocationClick?.(location)}
                            onMouseEnter={() => setHoveredLocation(location)}
                            onMouseLeave={() => setHoveredLocation(null)}
                        >
                            <div
                                className={`
                  w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200
                  ${getCategoryColor(location.category)}
                  ${isSelected ? 'scale-150 ring-2 ring-blue-400' : ''}
                  ${isHovered ? 'scale-125' : ''}
                `}
                            />

                            {/* Tooltip on hover */}
                            {isHovered && (
                                <Card className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-48 z-30">
                                    <CardContent className="p-3">
                                        <h4 className="font-semibold text-sm">{location.name}</h4>
                                        <p className="text-xs text-gray-600 mb-2">{location.address}</p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="text-xs">
                                                {location.category}
                                            </Badge>
                                            {location.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs">{location.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h4 className="text-sm font-semibold mb-2">Bay Area Locations</h4>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{locations.length} locations</span>
                </div>
            </div>
        </div>
    );
} 