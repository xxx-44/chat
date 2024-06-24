'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '../../../../firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Inputs = {
	email: string;
	password: string;
};

const Login = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await signInWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				router.push('/');
			})
			.catch((error) => {
				if (error.code === 'auth/user-not-found') {
					alert('存在しないユーザーです。');
				} else {
					alert(error.message);
				}
			});
	};

	return (
		<div className='h-screen flex flex-col items-center justify-center'>
			<form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg shadow-md w-96'>
				<h1 className='text-2xl mb-4 font-medium text-gray-700'>ログイン</h1>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-600'>Email</label>
					<input
						{...register('email', {
							required: 'メールアドレスは必須です',
							pattern: {
								value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
								message: '正しいメールアドレスを入力してください',
							},
						})}
						type='text'
						className='mt-1 border-2 rounded-md w-full p-2'
					/>
					{errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
				</div>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-600'>Password</label>
					<input
						{...register('password', {
							required: 'パスワードは必須です',
							minLength: {
								value: 6,
								message: 'パスワードは6文字以上にしてください',
							},
						})}
						type='password'
						className='mt-1 border-2 rounded-md w-full p-2'
					/>
					{errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
				</div>

				<div className='flex justify-end'>
					<button type='submit' className='bg-blue-500 text-white rounded py-2 font-bold px-4 hover:bg-blue-700'>
						ログイン
					</button>
				</div>
				<div className='mt-4'>
					<span className='text-sm text-gray-600'>アカウントをお持ちではないですか？</span>
					<Link href='/auth/register' className='text-blue-500 text-sm font-bold ml-1 hover:text-blue-700'>
						新規登録ページへ
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;
