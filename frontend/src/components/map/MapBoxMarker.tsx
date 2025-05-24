'use client';

import { memo } from 'react';
import { Location, LocationCategory } from '@/types';
import {
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
    MapPin
} from 'lucide-react';

interface MapBoxMarkerProps {
    location: Location;
    isSelected?: boolean;
    isHovered?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

// Category-specific marker configurations
const MARKER_CONFIG = {
    [LocationCategory.RESTAURANT]: {
        color: '#E53E3E',
        bgColor: '#FED7D7',
        icon: Utensils,
        glowColor: '#E53E3E'
    },
    [LocationCategory.CAFE]: {
        color: '#D69E2E',
        bgColor: '#FEEBC8',
        icon: Coffee,
        glowColor: '#D69E2E'
    },
    [LocationCategory.BAR]: {
        color: '#9F7AEA',
        bgColor: '#E9D8FD',
        icon: Wine,
        glowColor: '#9F7AEA'
    },
    [LocationCategory.SHOPPING]: {
        color: '#3182CE',
        bgColor: '#BEE3F8',
        icon: ShoppingBag,
        glowColor: '#3182CE'
    },
    [LocationCategory.PARK]: {
        color: '#38A169',
        bgColor: '#C6F6D5',
        icon: Trees,
        glowColor: '#38A169'
    },
    [LocationCategory.HIKE]: {
        color: '#319795',
        bgColor: '#B2F5EA',
        icon: Mountain,
        glowColor: '#319795'
    },
    [LocationCategory.VIEWPOINT]: {
        color: '#3182CE',
        bgColor: '#BEE3F8',
        icon: Camera,
        glowColor: '#3182CE'
    },
    [LocationCategory.MUSEUM]: {
        color: '#805AD5',
        bgColor: '#E9D8FD',
        icon: Palette,
        glowColor: '#805AD5'
    },
    [LocationCategory.ENTERTAINMENT]: {
        color: '#E53E3E',
        bgColor: '#FBB6CE',
        icon: Music,
        glowColor: '#E53E3E'
    },
    [LocationCategory.BEACH]: {
        color: '#0BC5EA',
        bgColor: '#C4F1F9',
        icon: Waves,
        glowColor: '#0BC5EA'
    },
    [LocationCategory.OTHER]: {
        color: '#718096',
        bgColor: '#E2E8F0',
        icon: MapPin,
        glowColor: '#718096'
    },
};

export const MapBoxMarker = memo(function MapBoxMarker({
    location,
    isSelected,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave
}: MapBoxMarkerProps) {
    const config = MARKER_CONFIG[location.category] || MARKER_CONFIG[LocationCategory.OTHER];
    const IconComponent = config.icon;

    // Animation classes based on state
    const getAnimationClasses = () => {
        if (isSelected) {
            return 'animate-bounce';
        }
        if (isHovered) {
            return 'animate-pulse';
        }
        return 'animate-pulse-gentle'; // Custom gentle pulse for idle state
    };

    // Scale and shadow based on state
    const getTransformClasses = () => {
        if (isSelected) {
            return 'scale-125';
        }
        if (isHovered) {
            return 'scale-110';
        }
        return 'scale-100';
    };

    // Glow effect for selected/hovered states
    const getGlowStyle = () => {
        if (isSelected) {
            return {
                boxShadow: `0 0 20px ${config.glowColor}80, 0 0 40px ${config.glowColor}40`,
            };
        }
        if (isHovered) {
            return {
                boxShadow: `0 0 15px ${config.glowColor}60, 0 0 30px ${config.glowColor}30`,
            };
        }
        return {
            boxShadow: `0 0 10px ${config.glowColor}40`,
        };
    };

    return (
        <div
            className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${getTransformClasses()}
        ${getAnimationClasses()}
      `}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                filter: isSelected ? 'brightness(1.1)' : isHovered ? 'brightness(1.05)' : 'brightness(1)',
            }}
        >
            {/* Main marker body */}
            <div
                className="
          w-8 h-8 rounded-full border-2 border-white 
          flex items-center justify-center
          transition-all duration-300 ease-out
        "
                style={{
                    backgroundColor: config.color,
                    ...getGlowStyle(),
                }}
            >
                <IconComponent
                    className="w-4 h-4 text-white"
                    strokeWidth={2.5}
                />
            </div>

            {/* Marker stem */}
            <div
                className="absolute top-6 left-1/2 transform -translate-x-1/2"
                style={{
                    width: '3px',
                    height: '12px',
                    backgroundColor: config.color,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                }}
            />

            {/* Location name label (appears on hover) */}
            {isHovered && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                        {location.name}
                        {/* Arrow pointing down */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                    </div>
                </div>
            )}

            {/* Selection ring */}
            {isSelected && (
                <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                        backgroundColor: `${config.glowColor}30`,
                        transform: 'scale(1.5)',
                    }}
                />
            )}

            {/* Rating indicator */}
            {location.rating && location.rating >= 4 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
                    <span className="text-xs text-white font-bold">★</span>
                </div>
            )}
        </div>
    );
});

// Define the custom gentle pulse animation in CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes pulse-gentle {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }
    .animate-pulse-gentle {
      animation: pulse-gentle 2s ease-in-out infinite;
    }
  `;
    document.head.appendChild(style);
} 