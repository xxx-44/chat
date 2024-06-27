'use client';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
	const { theme, setTheme, themeColors } = useAppContext();
	return (
		<div className={`${theme} color1 bg-bgC flex h-screen justify-center items-center`}>
			<div className='h-full flex container'>
				<div className='w-1/6 h-full border-r border-txtCs'>
					<Sidebar theme={theme} setTheme={setTheme} themeColors={themeColors} />
				</div>
				<div className='w-5/6 h-full '>
					<Chat />
				</div>
			</div>
		</div>
	);
}
