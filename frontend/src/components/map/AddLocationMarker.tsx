'use client';

import { Plus } from 'lucide-react';

export function AddLocationMarker() {
    return (
        <div className="relative animate-bounce">
            {/* Main marker body */}
            <div className="
        w-10 h-10 rounded-full border-3 border-white 
        bg-gradient-to-br from-blue-500 to-green-500
        flex items-center justify-center
        shadow-lg
        animate-pulse
      ">
                <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </div>

            {/* Marker stem */}
            <div
                className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-blue-500 to-green-500"
                style={{
                    width: '4px',
                    height: '16px',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                }}
            />

            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />

            {/* Drop shadow */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />
        </div>
    );
} 