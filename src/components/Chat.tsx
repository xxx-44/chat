'use client';

import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { db } from '../../firebase';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import LoadingIcons from 'react-loading-icons';

type Message = {
	text: string;
	sender: string;
	createdAt: Timestamp;
};

const Chat = () => {
	const [geminiResponse, setGeminiResponse] = useState<string>('test');
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

	const { selectedRoom } = useAppContext();
	const [inputMessage, setInputMessage] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
		setInputMessage('');
		setIsLoading(false);
		aiMessage();
	}, [geminiResponse]);

	return (
		<div className='bg-gray-500 h-full p-4 flex flex-col'>
			<h1 className='text-2xl text-white font-semibold mb-4'>Room 1</h1>
			<div className='flex-grow overflow-y-auto mb-4'>
				{messages.map((message, index) => (
					<div key={index} className={message.sender === 'user' ? 'text-right' : 'text-left'}>
						<div
							className={
								message.sender === 'user'
									? 'bg-white px-4 py-2 rounded-xl mb-2 inline-block'
									: 'bg-blue-300 px-4 py-2 rounded-xl mb-2 inline-block'
							}
						>
							<p>{message.text}</p>
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
