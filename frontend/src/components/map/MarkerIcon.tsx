'use client';

import { LocationCategory } from '@/types';
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

interface MarkerIconProps {
    category: LocationCategory;
    isSelected?: boolean;
    isHovered?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const markerStyles = {
    restaurant: {
        color: '#E53E3E',
        bgColor: 'bg-red-500',
        icon: Utensils,
        animation: 'animate-pulse'
    },
    cafe: {
        color: '#D69E2E',
        bgColor: 'bg-orange-500',
        icon: Coffee,
        animation: 'animate-steam'
    },
    bar: {
        color: '#9F7AEA',
        bgColor: 'bg-purple-500',
        icon: Wine,
        animation: 'animate-glow'
    },
    shopping: {
        color: '#3182CE',
        bgColor: 'bg-blue-500',
        icon: ShoppingBag,
        animation: 'animate-bounce'
    },
    park: {
        color: '#38A169',
        bgColor: 'bg-green-500',
        icon: Trees,
        animation: 'animate-sway'
    },
    hike: {
        color: '#319795',
        bgColor: 'bg-teal-500',
        icon: Mountain,
        animation: 'animate-bounce'
    },
    viewpoint: {
        color: '#3182CE',
        bgColor: 'bg-blue-600',
        icon: Camera,
        animation: 'animate-flash'
    },
    museum: {
        color: '#805AD5',
        bgColor: 'bg-purple-600',
        icon: Palette,
        animation: 'animate-pulse'
    },
    entertainment: {
        color: '#E53E3E',
        bgColor: 'bg-pink-500',
        icon: Music,
        animation: 'animate-bounce'
    },
    beach: {
        color: '#0BC5EA',
        bgColor: 'bg-cyan-500',
        icon: Waves,
        animation: 'animate-wave'
    },
    other: {
        color: '#718096',
        bgColor: 'bg-gray-500',
        icon: MapPin,
        animation: 'animate-pulse'
    },
};

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
};

const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

export function MarkerIcon({ category, isSelected, isHovered, size = 'md' }: MarkerIconProps) {
    const style = markerStyles[category] || markerStyles.other;
    const IconComponent = style.icon;

    const baseClasses = `
    ${sizeClasses[size]} 
    ${style.bgColor} 
    rounded-full 
    border-2 
    border-white 
    shadow-lg 
    flex 
    items-center 
    justify-center 
    transition-all 
    duration-300 
    ease-out
    relative
  `;

    const stateClasses = `
    ${isSelected ? 'scale-125 ring-2 ring-blue-400 ring-offset-2' : ''}
    ${isHovered ? 'scale-110 shadow-xl' : ''}
    ${!isSelected && !isHovered ? style.animation : ''}
  `;

    return (
        <div className={`${baseClasses} ${stateClasses}`}>
            <IconComponent
                className={`${iconSizeClasses[size]} text-white`}
                strokeWidth={2.5}
            />

            {/* Selection pulse effect */}
            {isSelected && (
                <div className={`
          absolute inset-0 
          ${style.bgColor} 
          rounded-full 
          animate-ping 
          opacity-75
        `} />
            )}

            {/* Hover glow effect */}
            {isHovered && (
                <div className={`
          absolute inset-0 
          ${style.bgColor} 
          rounded-full 
          animate-pulse 
          opacity-50 
          scale-150
        `} />
            )}
        </div>
    );
} 