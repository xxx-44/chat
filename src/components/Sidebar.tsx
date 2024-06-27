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

const Sidebar = ({
	theme,
	setTheme,
	themeColors,
}: {
	theme: string | null;
	setTheme: React.Dispatch<React.SetStateAction<string | null>>;
	themeColors: string[] | null;
}) => {
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
		<div className='h-full overflow-y-auto px-5 flex flex-col bg-bgCs'>
			<div className='flex-grow'>
				{user && (
					<div className='p-1 my-5 break-all bg-txtCs font-thin sm:text-sm text-xs text-bgCs flex items-center justify-center'>
						{user.email}
					</div>
				)}
				<div
					onClick={addNewRoom}
					className='cursor-pointer p-1 flex items-center justify-evenly mt-2 mx-2 rounded-md border hover:bg-bgCsh duration-150'
				>
					<span className='text-txtCs hidden pb-1 sm:inline-block sm:text-2xl'>+</span>
					<h1 className='text-txtCs text-xs md:text-base lg:text-lg sm:text-sm font-bold'>New Chat</h1>
				</div>
				<ul>
					{rooms.map((room) => (
						<li
							key={room.id}
							className='mt-2 cursor-pointer border-b p-4 text-txtCs duration-150 hover:bg-bgCsh'
							onClick={() => selectRoom(room.id, room.name)}
						>
							{room.name}
						</li>
					))}
				</ul>
			</div>

			{/* <div className='flex justify-center items-center gap-3 h-10'>
				{themeColors?.map((color) => (
					<button
						className={` ${color} w-5 h-5 bg-bgCs border border-txtCs`}
						key={color}
						onClick={() => setTheme(color)}
					></button>
				))}
			</div> */}

			<div
				onClick={() => handlelogout()}
				className='flex mb-3 cursor-pointer p-2 sm:text-base text-xs hover:bg-bgCsh duration-150 justify-center items-center text-txtCs'
			>
				<CiLogout />
				<span className='ml-2'>Log Out</span>
			</div>
		</div>
	);
};

export default Sidebar;
