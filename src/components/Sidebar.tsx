'use client';

import { Timestamp, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { CiLogout } from 'react-icons/ci';
import { db } from '../../firebase';
import { useAppContext } from '@/context/AppContext';

type Room = {
	id: string;
	name: string;
	createdAt: Timestamp;
};

const Sidebar = () => {
	const { user, userId, setSelectedRoom } = useAppContext();

	const [rooms, setRooms] = useState<Room[]>([]);
	useEffect(() => {
		if (user) {
			const fetchRooms = async () => {
				const roomCollectionRef = collection(db, 'rooms');
				const q = query(roomCollectionRef, where('userId', '==', userId), orderBy('createdAt'));
				const unsubscribe = onSnapshot(q, (snapshot) => {
					const newRooms: Room[] = snapshot.docs.map((doc) => ({
						id: doc.id,
						name: doc.data().name,
						createdAt: doc.data().createdAt,
					}));
					setRooms(newRooms);
				});
				return () => unsubscribe();
			};
			fetchRooms();
		}
	}, [userId]);

	const selectRoom = (roomid: string) => {
		setSelectedRoom(roomid);
	};

	return (
		<div className='h-full overflow-y-auto px-5 flex flex-col bg-slate-500'>
			<div className='flex-grow'>
				<div className='cursor-pointer flex items-center justify-evenly mt-2 mx-2 rounded-md border p-1 dur hover:bg-slate-400'>
					<span className='text-white text-2xl pb-1'>+</span>
					<h1 className='text-white text-xl font-bold'>New Chat</h1>
				</div>
				<ul>
					{rooms.map((room) => (
						<li
							key={room.id}
							className='mt-2 cursor-pointer border-b p-4 text-slate-300 duration-150 hover:bg-slate-400'
							onClick={() => selectRoom(room.id)}
						>
							{room.name}
						</li>
					))}
				</ul>
			</div>

			<div className='flex mb-3 cursor-pointer p-2 hover:bg-slate-400 duration-150 justify-center items-center text-slate-200'>
				<CiLogout />
				<span className='ml-2'>Log Out</span>
			</div>
		</div>
	);
};

export default Sidebar;
