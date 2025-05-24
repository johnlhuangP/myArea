'use client';

import { Location } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Star,
    DollarSign,
    MapPin,
    ExternalLink,
    Navigation,
    User,
    Calendar,
    Tag
} from 'lucide-react';

interface LocationPopupProps {
    location: Location;
    onClose?: () => void;
}

export function LocationPopup({ location, onClose }: LocationPopupProps) {
    const formatCategory = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            restaurant: 'bg-red-100 text-red-800 border-red-200',
            cafe: 'bg-orange-100 text-orange-800 border-orange-200',
            bar: 'bg-purple-100 text-purple-800 border-purple-200',
            shopping: 'bg-blue-100 text-blue-800 border-blue-200',
            park: 'bg-green-100 text-green-800 border-green-200',
            hike: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            museum: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
            beach: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            viewpoint: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            other: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[category] || colors.other;
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

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm font-medium ml-1">{rating}/5</span>
            </div>
        );
    };

    const handleDirections = () => {
        const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
        window.open(mapsUrl, '_blank');
    };

    const handleWebsite = () => {
        if (location.website_url) {
            window.open(location.website_url, '_blank');
        }
    };

    return (
        <div className="w-80 max-w-sm">
            {/* Header with image */}
            {location.image_url && (
                <div className="relative h-32 mb-3 rounded-t-lg overflow-hidden">
                    <img
                        src={location.image_url}
                        alt={location.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            )}

            {/* Main content */}
            <div className="space-y-3">
                {/* Title and category */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{location.name}</h3>
                    <Badge className={`${getCategoryColor(location.category)} text-xs shrink-0`}>
                        {formatCategory(location.category)}
                    </Badge>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{location.address}</span>
                </div>

                {/* Description */}
                {location.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {location.description}
                    </p>
                )}

                {/* Rating and Price */}
                <div className="flex items-center justify-between">
                    {location.rating && (
                        <div className="flex items-center gap-2">
                            {renderStars(location.rating)}
                        </div>
                    )}

                    {location.price_level && (
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Price:</span>
                            {renderPriceLevel(location.price_level)}
                        </div>
                    )}
                </div>

                {/* Tags */}
                {location.tags && location.tags.length > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Tag className="w-3 h-3" />
                            <span>Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {location.tags.slice(0, 5).map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-gray-50"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {location.tags.length > 5 && (
                                <Badge variant="outline" className="text-xs bg-gray-50">
                                    +{location.tags.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* User info */}
                {location.user && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <User className="w-3 h-3" />
                        <span>Added by {location.user.display_name}</span>
                        {location.created_at && (
                            <>
                                <Calendar className="w-3 h-3 ml-2" />
                                <span>{new Date(location.created_at).toLocaleDateString()}</span>
                            </>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDirections}
                        className="flex-1 text-xs"
                    >
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                    </Button>

                    {location.website_url && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleWebsite}
                            className="flex-1 text-xs"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Website
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
} 