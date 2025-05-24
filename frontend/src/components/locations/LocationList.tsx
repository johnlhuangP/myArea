'use client';

import { Location } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ExternalLink, DollarSign } from 'lucide-react';

interface LocationListProps {
    locations: Location[];
    onLocationClick?: (location: Location) => void;
    selectedLocation?: Location | null;
    showUserInfo?: boolean;
}

export function LocationList({
    locations,
    onLocationClick,
    selectedLocation,
    showUserInfo = true
}: LocationListProps) {
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            restaurant: 'bg-red-100 text-red-800',
            cafe: 'bg-orange-100 text-orange-800',
            bar: 'bg-purple-100 text-purple-800',
            shopping: 'bg-blue-100 text-blue-800',
            park: 'bg-green-100 text-green-800',
            hike: 'bg-emerald-100 text-emerald-800',
            museum: 'bg-indigo-100 text-indigo-800',
            entertainment: 'bg-pink-100 text-pink-800',
            beach: 'bg-cyan-100 text-cyan-800',
            viewpoint: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[category] || colors.other;
    };

    const formatCategory = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const renderPriceLevel = (level?: number) => {
        if (!level) return null;
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                    <DollarSign
                        key={i}
                        className={`w-3 h-3 ${i < level ? 'text-green-600' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (locations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No locations found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {locations.map((location) => {
                const isSelected = selectedLocation?.id === location.id;

                return (
                    <Card
                        key={location.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-400 shadow-md' : ''
                            }`}
                        onClick={() => onLocationClick?.(location)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>

                                    {location.description && (
                                        <p className="text-sm text-gray-700 mb-3">{location.description}</p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2 ml-4">
                                    <Badge className={getCategoryColor(location.category)}>
                                        {formatCategory(location.category)}
                                    </Badge>

                                    {location.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{location.rating}</span>
                                        </div>
                                    )}

                                    {location.price_level && renderPriceLevel(location.price_level)}
                                </div>
                            </div>

                            {/* Tags */}
                            {location.tags && location.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {location.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                {showUserInfo && location.user && (
                                    <div className="text-xs text-gray-500">
                                        Added by {location.user.display_name}
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {location.website_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(location.website_url, '_blank');
                                            }}
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Visit
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                                            window.open(mapsUrl, '_blank');
                                        }}
                                    >
                                        <MapPin className="w-3 h-3 mr-1" />
                                        Directions
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 