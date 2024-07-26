import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
	title: 'GeminiAPI App',
	description: 'ohayou',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ja'>
			<body>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
