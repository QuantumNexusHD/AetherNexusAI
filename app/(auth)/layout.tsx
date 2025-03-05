import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import dotenv from 'dotenv';

dotenv.config();

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const AuthClerk = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <ClerkProvider publishableKey={publishableKey}>           
            {children}
        </ClerkProvider>
    );
}

export default AuthClerk;