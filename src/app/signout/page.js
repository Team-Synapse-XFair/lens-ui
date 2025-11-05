'use client';

import React from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutPage() {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="flex items-center justify-center bg-background px-4" style={{ height: "calc(100vh - var(--header-height))" }}>
            <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Signing Out...</h2>
                {handleSignOut()}
            </div>
        </div>
    );
}