'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, User, LogOut, Plus } from 'lucide-react';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const [authDialog, setAuthDialog] = useState<'login' | 'register' | null>(null);

    const handleAuthSuccess = () => {
        setAuthDialog(null);
    };

    return (
        <>
            <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            MyArea
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Explore
                        </Link>
                        {isAuthenticated && (
                            <Link href="/my-locations" className="text-gray-600 hover:text-gray-900 transition-colors">
                                My Locations
                            </Link>
                        )}
                    </nav>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/add-location">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Location
                                    </Link>
                                </Button>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4" />
                                        <span className="hidden sm:inline">{user?.display_name}</span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:ml-1 sm:inline">Logout</span>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAuthDialog('login')}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setAuthDialog('register')}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Auth Dialog */}
            <Dialog open={!!authDialog} onOpenChange={() => setAuthDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    {authDialog === 'login' ? (
                        <LoginForm
                            onSuccess={handleAuthSuccess}
                            onSwitchToRegister={() => setAuthDialog('register')}
                        />
                    ) : authDialog === 'register' ? (
                        <RegisterForm
                            onSuccess={handleAuthSuccess}
                            onSwitchToLogin={() => setAuthDialog('login')}
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
} 