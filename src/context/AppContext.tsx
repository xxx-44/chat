'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';

type AppProviderProps = {
	children: React.ReactNode;
};

type AppContextType = {
	user: User | null;
	userId: string | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	selectedRoom: string | null;
	setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContextDara = {
	user: null,
	userId: null,
	setUser: () => {},
	selectedRoom: null,
	setSelectedRoom: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextDara);

export function AppProvider({ children }: AppProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (newUser) => {
			setUser(newUser);
			setUserId(newUser ? newUser.uid : null);
		});

		return () => {
			unsubscribe();
		};
	});

	return (
		<AppContext.Provider value={{ user, setUser, userId, selectedRoom, setSelectedRoom }}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
