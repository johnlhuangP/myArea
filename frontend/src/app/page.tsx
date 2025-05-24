'use client';

import { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { SimpleMap } from '@/components/map/SimpleMap';
import { LocationList } from '@/components/locations/LocationList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Location, LocationCategory } from '@/types';
import { MapPin, List, Filter } from 'lucide-react';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: locationsData, isLoading, error } = useLocations('San Francisco', selectedCategory || undefined);

  const locations = locationsData?.locations || [];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: LocationCategory.RESTAURANT, label: 'Restaurants' },
    { value: LocationCategory.CAFE, label: 'Cafes' },
    { value: LocationCategory.BAR, label: 'Bars' },
    { value: LocationCategory.PARK, label: 'Parks' },
    { value: LocationCategory.HIKE, label: 'Hikes' },
    { value: LocationCategory.VIEWPOINT, label: 'Viewpoints' },
    { value: LocationCategory.SHOPPING, label: 'Shopping' },
    { value: LocationCategory.MUSEUM, label: 'Museums' },
    { value: LocationCategory.ENTERTAINMENT, label: 'Entertainment' },
    { value: LocationCategory.BEACH, label: 'Beaches' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Bay Area locations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load locations</p>
            <p className="text-sm text-gray-600">Please try again later</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Discover the Bay Area
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore local favorites and hidden gems recommended by people who know the area best.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Map
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {locations.length} location{locations.length !== 1 ? 's' : ''} in the Bay Area
          {selectedCategory && ` • ${categories.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map/List View */}
        <div className="lg:col-span-2">
          {viewMode === 'map' ? (
            <SimpleMap
              locations={locations}
              onLocationClick={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <LocationList
                locations={locations}
                onLocationClick={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
          )}
        </div>

        {/* Selected Location Details */}
        <div className="lg:col-span-1">
          {selectedLocation ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedLocation.name}</CardTitle>
                <CardDescription>{selectedLocation.address}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLocation.description && (
                  <p className="text-sm text-gray-700 mb-4">{selectedLocation.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <Badge>{selectedLocation.category}</Badge>
                  </div>

                  {selectedLocation.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating</span>
                      <span className="text-sm">{selectedLocation.rating}/5 ⭐</span>
                    </div>
                  )}

                  {selectedLocation.price_level && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Price</span>
                      <span className="text-sm">{'$'.repeat(selectedLocation.price_level)}</span>
                    </div>
                  )}

                  {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium block mb-2">Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocation.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLocation.user && (
                    <div className="pt-3 border-t">
                      <span className="text-xs text-gray-500">
                        Added by {selectedLocation.user.display_name}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a location to see details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
