'use client';

import { useState } from 'react';
import { Location, LocationCategory } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Filter,
    X,
    Utensils,
    Coffee,
    Wine,
    ShoppingBag,
    Trees,
    Mountain,
    Camera,
    Palette,
    Music,
    Waves,
    MapPin,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface CategoryFilterProps {
    locations: Location[];
    filteredCategories: Set<LocationCategory>;
    onCategoryToggle: (category: LocationCategory) => void;
    onClearFilters: () => void;
}

// Category configurations with icons and colors
const CATEGORY_CONFIG = {
    [LocationCategory.RESTAURANT]: {
        icon: Utensils,
        label: 'Restaurants',
        color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
    },
    [LocationCategory.CAFE]: {
        icon: Coffee,
        label: 'Cafes',
        color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
    },
    [LocationCategory.BAR]: {
        icon: Wine,
        label: 'Bars',
        color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
    },
    [LocationCategory.SHOPPING]: {
        icon: ShoppingBag,
        label: 'Shopping',
        color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
    },
    [LocationCategory.PARK]: {
        icon: Trees,
        label: 'Parks',
        color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    },
    [LocationCategory.HIKE]: {
        icon: Mountain,
        label: 'Hiking',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
    },
    [LocationCategory.VIEWPOINT]: {
        icon: Camera,
        label: 'Viewpoints',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
    },
    [LocationCategory.MUSEUM]: {
        icon: Palette,
        label: 'Museums',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200'
    },
    [LocationCategory.ENTERTAINMENT]: {
        icon: Music,
        label: 'Entertainment',
        color: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200'
    },
    [LocationCategory.BEACH]: {
        icon: Waves,
        label: 'Beaches',
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200'
    },
    [LocationCategory.OTHER]: {
        icon: MapPin,
        label: 'Other',
        color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    },
};

export function CategoryFilter({
    locations,
    filteredCategories,
    onCategoryToggle,
    onClearFilters
}: CategoryFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate category counts
    const categoryCounts = locations.reduce((acc, location) => {
        const category = location.category as LocationCategory;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<LocationCategory, number>);

    // Get categories that have locations
    const availableCategories = Object.keys(categoryCounts) as LocationCategory[];

    // Filter locations based on selected categories
    const filteredCount = filteredCategories.size === 0
        ? locations.length
        : locations.filter(loc => filteredCategories.has(loc.category as LocationCategory)).length;

    const hasActiveFilters = filteredCategories.size > 0;

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-sm">Filters</span>
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="text-xs">
                            {filteredCategories.size}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onClearFilters}
                            className="h-6 px-2 text-xs"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Clear
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-6 px-2"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Results summary */}
            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600">
                Showing {filteredCount} of {locations.length} locations
            </div>

            {/* Category filters */}
            {isExpanded && (
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                    {availableCategories.map((category) => {
                        const config = CATEGORY_CONFIG[category];
                        const IconComponent = config.icon;
                        const count = categoryCounts[category];
                        const isActive = filteredCategories.has(category);

                        return (
                            <button
                                key={category}
                                onClick={() => onCategoryToggle(category)}
                                className={`
                  w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200
                  ${isActive
                                        ? config.color.replace('hover:', '')
                                        : 'bg-white hover:bg-gray-50 border-gray-200'
                                    }
                `}
                            >
                                <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span className="text-sm font-medium">{config.label}</span>
                                </div>

                                <Badge
                                    variant={isActive ? "secondary" : "outline"}
                                    className="text-xs"
                                >
                                    {count}
                                </Badge>
                            </button>
                        );
                    })}

                    {/* Bulk actions */}
                    <div className="pt-2 border-t space-y-1">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                // Select all categories
                                availableCategories.forEach(category => {
                                    if (!filteredCategories.has(category)) {
                                        onCategoryToggle(category);
                                    }
                                });
                            }}
                            className="w-full text-xs h-8"
                            disabled={filteredCategories.size === availableCategories.length}
                        >
                            Select All
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onClearFilters}
                            className="w-full text-xs h-8"
                            disabled={filteredCategories.size === 0}
                        >
                            Clear All
                        </Button>
                    </div>
                </div>
            )}

            {/* Quick filter chips (when collapsed) */}
            {!isExpanded && hasActiveFilters && (
                <div className="p-3 pt-0">
                    <div className="flex flex-wrap gap-1">
                        {Array.from(filteredCategories).slice(0, 3).map((category) => {
                            const config = CATEGORY_CONFIG[category];
                            const IconComponent = config.icon;

                            return (
                                <button
                                    key={category}
                                    onClick={() => onCategoryToggle(category)}
                                    className={`
                    flex items-center gap-1 px-2 py-1 rounded text-xs border
                    ${config.color}
                  `}
                                >
                                    <IconComponent className="w-3 h-3" />
                                    <span>{config.label}</span>
                                    <X className="w-3 h-3 ml-1" />
                                </button>
                            );
                        })}

                        {filteredCategories.size > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{filteredCategories.size - 3} more
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 