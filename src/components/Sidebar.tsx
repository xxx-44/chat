'use client';

import { Timestamp, addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { CiLogout } from 'react-icons/ci';
import { auth, db } from '../../firebase';
import { useAppContext } from '@/context/AppContext';

type Room = {
	id: string;
	name: string;
	createdAt: Timestamp;
};

const Sidebar = () => {
	const { user, userId, setSelectedRoom, setSelectedRoomName } = useAppContext();

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

	const selectRoom = (roomid: string, roomName: string) => {
		setSelectedRoom(roomid);
		setSelectedRoomName(roomName);
	};

	const addNewRoom = async () => {
		const roomName = prompt('New Room Name');
		if (roomName) {
			const newRoomRef = collection(db, 'rooms');
			await addDoc(newRoomRef, {
				name: roomName,
				userId: userId,
				createdAt: serverTimestamp(),
			});
		}
	};

	const handlelogout = () => {
		auth.signOut();
	};

	return (
		<div className='h-full overflow-y-auto px-5 flex flex-col bg-slate-500'>
			<div className='flex-grow'>
				{user && (
					<div className='p-1 my-5 break-all bg-slate-200 font-thin sm:text-sm text-xs text-slate-500 flex items-center justify-center'>
						{user.email}
					</div>
				)}
				<div
					onClick={addNewRoom}
					className='cursor-pointer p-1 flex items-center justify-evenly mt-2 mx-2 rounded-md border hover:bg-slate-400 duration-150'
				>
					<span className='text-white hidden pb-1 sm:inline-block sm:text-2xl'>+</span>
					<h1 className='text-white text-xs md:text-base lg:text-lg sm:text-sm font-bold'>New Chat</h1>
				</div>
				<ul>
					{rooms.map((room) => (
						<li
							key={room.id}
							className='mt-2 cursor-pointer border-b p-4 text-slate-100 duration-150 hover:bg-slate-400'
							onClick={() => selectRoom(room.id, room.name)}
						>
							{room.name}
						</li>
					))}
				</ul>
			</div>

			<div
				onClick={() => handlelogout()}
				className='flex mb-3 cursor-pointer p-2 sm:text-base text-xs hover:bg-slate-400 duration-150 justify-center items-center text-slate-200'
			>
				<CiLogout />
				<span className='ml-2'>Log Out</span>
			</div>
		</div>
	);
};

export default Sidebar;
