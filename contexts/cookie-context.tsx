'use client';

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { AddressData } from '@/types/user';

interface CookieContextType {
	token: string | null;
	user: {
		userId: number;
		role: 'user' | 'superadmin' | 'admin';
		// User specific fields
		name?: string;
		email?: string;
		school?: string;
		mobile?: string;
		rollno?: string;
		branch?: string;
		address?: AddressData;
		// Admin and SuperAdmin specific fields
		username?: string;
	} | null;
}

export const CookieContext = createContext<CookieContextType | null>(null);

export const useCookies = (): CookieContextType => {
	const context = useContext(CookieContext);
	if (!context) {
		throw new Error('useCookies must be used within a CookieProvider');
	}
	return context;
};

export const CookieProvider = ({
	children,
	token,
	user,
}: PropsWithChildren<{
	token: string | undefined;
	user: CookieContextType['user'];
}>) => {
	// Memoize the context value to prevent unnecessary re-renders
	const providerValue = useMemo(
		() => ({
			token: token || null,
			user: user || null,
		}),
		[token, user]
	);

	return (
		<CookieContext.Provider value={providerValue}>
			{children}
		</CookieContext.Provider>
	);
};
