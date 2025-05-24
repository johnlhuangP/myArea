'use client';

import { useState } from 'react';
import { useLocations } from '@/hooks/useLocations';
import { SimpleMapBox } from '@/components/map/SimpleMapBox';
import { LocationList } from '@/components/locations/LocationList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Location, LocationCategory } from '@/types';
import { MapPin, List, Plus } from 'lucide-react';
import '../styles/mapbox.css';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const { data: locationsData, isLoading, error, refetch } = useLocations('San Francisco');

  const locations = locationsData?.locations || [];

  const handleLocationAdded = (location: Location) => {
    // Refresh the locations list
    refetch();
    // Select the newly added location
    setSelectedLocation(location);
  };

  const handleAddLocation = (lat: number, lng: number) => {
    // This would integrate with a location creation form
    console.log('Add location at:', lat, lng);
    // For now, we'll just log the coordinates
    // In a real implementation, this would open a form or modal
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-full h-96 mapbox-loading rounded-lg border"></div>
            <p className="text-gray-600 mt-4">Loading Bay Area locations...</p>
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
      {/* <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Discover the Bay Area
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore local favorites and hidden gems recommended by people who know the area best.
        </p>
      </div> */}

      {/* View Toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('map')}
        >
          <MapPin className="w-4 h-4 mr-1" />
          Map View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4 mr-1" />
          List View
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map/List View */}
        <div className="lg:col-span-2">
          {viewMode === 'map' ? (
            <SimpleMapBox
              locations={locations}
              onLocationClick={setSelectedLocation}
              selectedLocation={selectedLocation}
              onAddLocation={handleAddLocation}
            />
          ) : (
            <div className="max-h-96 overflow-y-auto border rounded-lg">
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
                <p className="text-xs mt-2">
                  Click on any marker on the map or item in the list
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      {/* <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-4 text-sm text-gray-600 bg-white rounded-lg px-6 py-3 shadow-sm border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{locations.length} total locations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Bay Area focused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Community curated</span>
          </div>
        </div>
      </div>*/}
    </div>
  );
}
