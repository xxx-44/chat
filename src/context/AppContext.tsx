'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

type AppProviderProps = {
	children: React.ReactNode;
};

type AppContextType = {
	user: User | null;
	userId: string | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	selectedRoom: string | null;
	setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
	selectedRoomName: string | null;
	setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContextDara = {
	user: null,
	userId: null,
	setUser: () => {},
	selectedRoom: null,
	setSelectedRoom: () => {},
	selectedRoomName: null,
	setSelectedRoomName: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextDara);

export function AppProvider({ children }: AppProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
	const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (newUser) => {
			setUser(newUser);
			setUserId(newUser ? newUser.uid : null);

			if (!newUser) {
				router.push('/auth/login');
			}
		});

		return () => {
			unsubscribe();
		};
	});

	return (
		<AppContext.Provider
			value={{ user, setUser, userId, selectedRoom, setSelectedRoom, selectedRoomName, setSelectedRoomName }}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
