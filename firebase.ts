import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAuk06kmHsErgn7gyzjdsp2jpEuERm4Oa8',
	authDomain: 'chat-3d420.firebaseapp.com',
	projectId: 'chat-3d420',
	storageBucket: 'chat-3d420.appspot.com',
	messagingSenderId: '105618691449',
	appId: '1:105618691449:web:4b4b6376aacc1360b94ba8',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
