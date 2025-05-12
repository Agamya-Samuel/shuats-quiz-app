'use client';

import { createContext, PropsWithChildren, useContext, useMemo, useEffect, useState } from 'react';

interface CookieContextType {
	token: string | null;
	user: {
		userId: string;
		role: 'user' | 'superadmin' | 'maintainer';
		username?: string;
		name?: string;
		email?: string;
		school?: string;
		mobile?: string;
		rollNo?: string;
		branch?: string;
		address?: string;
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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Memoize the context value to prevent unnecessary re-renders
	const providerValue = useMemo(
		() => ({
			token: token || null,
			user: user || null,
		}),
		[token, user]
	);

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return null;
	}

	return (
		<CookieContext.Provider value={providerValue}>
			{children}
		</CookieContext.Provider>
	);
};
