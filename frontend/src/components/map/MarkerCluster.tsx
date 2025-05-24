'use client';

import { useState } from 'react';
import { Location } from '@/types';
import { MarkerIcon } from './MarkerIcon';
import { Badge } from '@/components/ui/badge';

interface MarkerClusterProps {
    locations: Location[];
    onLocationClick?: (location: Location) => void;
    selectedLocation?: Location | null;
    position: { x: number; y: number };
}

export function MarkerCluster({
    locations,
    onLocationClick,
    selectedLocation,
    position
}: MarkerClusterProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // If only one location, render single marker
    if (locations.length === 1) {
        const location = locations[0];
        const isSelected = selectedLocation?.id === location.id;

        return (
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-marker-enter"
                style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: isSelected ? 20 : 10,
                }}
                onClick={() => onLocationClick?.(location)}
            >
                <MarkerIcon
                    category={location.category}
                    isSelected={isSelected}
                />
            </div>
        );
    }

    // Multiple locations - render cluster
    const clusterSize = locations.length;
    const hasSelectedLocation = locations.some(loc => loc.id === selectedLocation?.id);

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: hasSelectedLocation ? 25 : 15,
            }}
        >
            {!isExpanded ? (
                // Cluster view
                <div
                    className={`
            relative cursor-pointer transition-all duration-300
            ${hasSelectedLocation ? 'scale-110' : ''}
          `}
                    onClick={() => setIsExpanded(true)}
                >
                    {/* Main cluster marker */}
                    <div className={`
            w-12 h-12 
            bg-gradient-to-br from-blue-500 to-blue-600 
            rounded-full 
            border-3 
            border-white 
            shadow-lg 
            flex 
            items-center 
            justify-center
            hover:scale-110
            transition-transform
            duration-200
            ${hasSelectedLocation ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
          `}>
                        <span className="text-white font-bold text-sm">
                            {clusterSize}
                        </span>
                    </div>

                    {/* Category indicators */}
                    <div className="absolute -top-1 -right-1 flex">
                        {Array.from(new Set(locations.map(loc => loc.category)))
                            .slice(0, 3)
                            .map((category, index) => (
                                <div
                                    key={category}
                                    className={`
                    transform 
                    ${index === 0 ? 'translate-x-0' : index === 1 ? 'translate-x-1' : 'translate-x-2'}
                  `}
                                    style={{ zIndex: 3 - index }}
                                >
                                    <MarkerIcon
                                        category={category as any}
                                        size="sm"
                                    />
                                </div>
                            ))
                        }
                    </div>

                    {/* Pulse animation for cluster */}
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25" />
                </div>
            ) : (
                // Expanded view
                <div className="relative">
                    {/* Background overlay */}
                    <div
                        className="fixed inset-0 bg-black/20 z-10"
                        onClick={() => setIsExpanded(false)}
                    />

                    {/* Expanded markers */}
                    <div className="relative z-20">
                        {locations.map((location, index) => {
                            const isSelected = selectedLocation?.id === location.id;
                            const angle = (index / locations.length) * 2 * Math.PI;
                            const radius = 40;
                            const offsetX = Math.cos(angle) * radius;
                            const offsetY = Math.sin(angle) * radius;

                            return (
                                <div
                                    key={location.id}
                                    className={`
                    absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2
                    animate-marker-enter
                  `}
                                    style={{
                                        left: `${offsetX}px`,
                                        top: `${offsetY}px`,
                                        animationDelay: `${index * 50}ms`,
                                        zIndex: isSelected ? 25 : 20,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onLocationClick?.(location);
                                        setIsExpanded(false);
                                    }}
                                >
                                    <MarkerIcon
                                        category={location.category}
                                        isSelected={isSelected}
                                    />

                                    {/* Location name label */}
                                    <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-max">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-white/90 backdrop-blur-sm shadow-sm"
                                        >
                                            {location.name}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Center close button */}
                        <div
                            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-30"
                            onClick={() => setIsExpanded(false)}
                        >
                            <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <span className="text-white text-xs">×</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 