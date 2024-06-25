'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { db } from '../../firebase';
import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
} from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import LoadingIcons from 'react-loading-icons';
import ReactMarkdown from 'react-markdown';

type Message = {
	text: string;
	sender: string;
	createdAt: Timestamp;
};

const Chat = () => {
	const [geminiResponse, setGeminiResponse] = useState<string>('');
	const Gemini = (prompt: string) => {
		const postData = async () => {
			const response = await fetch('/api/gemini-api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ prompt_post: prompt }), //promptに入力する文字を入れる
			});
			const data = await response.json();
			setGeminiResponse(data.message);
		};
		postData();
	};

	const { setSelectedRoom, setSelectedRoomName, selectedRoom, selectedRoomName } = useAppContext();
	const [inputMessage, setInputMessage] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const scroolDiv = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (selectedRoom) {
			const fetchMessages = async () => {
				const roomDocRef = doc(db, 'rooms', selectedRoom);
				const messageCollectionRef = collection(roomDocRef, 'messages');

				const q = query(messageCollectionRef, orderBy('createdAt'));

				const unsubscribe = onSnapshot(q, (snapshot) => {
					const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
					setMessages(newMessages);
				});
				return () => unsubscribe();
			};
			fetchMessages();
		}
	}, [selectedRoom]);

	const sendMessage = async () => {
		if (!inputMessage.trim()) return;

		setIsLoading(true);

		Gemini(inputMessage);

		const messageData = {
			text: inputMessage,
			sender: 'user',
			createdAt: serverTimestamp(),
		};

		const roomDocRef = doc(db, 'rooms', selectedRoom!);
		const messageCollectionRef = collection(roomDocRef, 'messages');
		await addDoc(messageCollectionRef, messageData);
	};

	const aiMessage = async () => {
		const aiMessageData = {
			text: geminiResponse,
			sender: 'ai',
			createdAt: serverTimestamp(),
		};

		const roomDocRef = doc(db, 'rooms', selectedRoom!);
		const messageCollectionRef = collection(roomDocRef, 'messages');
		await addDoc(messageCollectionRef, aiMessageData);
	};

	useEffect(() => {
		if (geminiResponse != '') {
			setInputMessage('');
			setIsLoading(false);
			aiMessage();
		}
	}, [geminiResponse]);

	useEffect(() => {
		if (scroolDiv.current) {
			const element = scroolDiv.current;
			element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
		}
	}, [messages]);

	const [isOn, setIsOn] = useState(false);
	const handleToggle = () => {
		setIsOn(!isOn);
	};

	const deleteRoom = async () => {
		if (isOn) {
			const roomDocRef = doc(db, 'rooms', selectedRoom!);
			await deleteDoc(roomDocRef);
			setSelectedRoom(null);
			setSelectedRoomName(null);
		}
	};

	return (
		<div className='bg-gray-500 h-full p-4 flex flex-col'>
			<div className='flex justify-between'>
				<h1 className='text-2xl text-white font-semibold mb-4'>{selectedRoomName}</h1>
				{selectedRoomName && (
					<div className='flex items-center mb-4'>
						<button
							className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-gray-300 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${isOn ? 'bg-red-700' : 'bg-gray-200'}`}
							onClick={handleToggle}
						>
							{' '}
							<span
								className={`absolute inset-0 flex items-center justify-center transition-transform ease-in-out duration-200 ${isOn ? 'translate-x-1' : '-translate-x-2'}`}
							>
								{' '}
								<span
									className={`w-4 h-4 bg-white rounded-full shadow-lg transform ${isOn ? 'translate-x-1' : 'translate-x-0'}`}
								/>{' '}
							</span>{' '}
						</button>
						<button
							onClick={() => deleteRoom()}
							className={`px-2 py-1 border rounded-lg  text-sm ml-4 ${isOn ? ' border-red-700 bg-red-700 cursor-pointer text-white' : 'border-slate-300 text-slate-300 cursor-default'}`}
						>
							Delete
						</button>
					</div>
				)}
			</div>

			<div className='flex-grow overflow-y-auto mb-4' ref={scroolDiv}>
				{messages.map((message, index) => (
					<div key={index} className={message.sender === 'user' ? 'text-right' : 'text-left'}>
						<div
							className={
								message.sender === 'user'
									? 'bg-white px-4 py-2 rounded-xl mb-2 inline-block'
									: 'bg-blue-300 px-4 py-2 rounded-xl mb-2 inline-block'
							}
						>
							<ReactMarkdown>{message.text}</ReactMarkdown>
						</div>
					</div>
				))}
				{isLoading && <LoadingIcons.TailSpin />}
			</div>

			<div className='flex-shrink-0 relative flex'>
				<input
					type='text'
					placeholder='Send a Message'
					value={inputMessage}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							sendMessage();
						}
					}}
					className='border-2 rounded w-full py-1 pr-10 pl-4 focus:outline-none'
					onChange={(e) => setInputMessage(e.target.value)}
				/>
				{/* <button className='absolute right-0 px-5 rounded items-center flex inset-y-0 bg-slate-400'> */}
				<button
					className='bg-slate-400 px-5 rounded ml-4 text-white hover:bg-slate-600 duration-150 cursor-pointer'
					onClick={() => sendMessage()}
				>
					<FaPaperPlane />
				</button>
			</div>
		</div>
	);
};

export default Chat;
