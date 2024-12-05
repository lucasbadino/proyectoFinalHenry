'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const APIURL = process.env.NEXT_PUBLIC_API_URL;
export default function LoginGoogle() {
    const router = useRouter();
    useEffect(() => {
        const handleGoogleLogin = async () => {
            try {
                const googleResponse = await fetch('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (googleResponse.ok) {
                    const googleUser = await googleResponse.json();
                    if (googleUser?.email && googleUser.sub) {
                        const Flag = await fetch(`${APIURL}/user/google`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',

                            },
                            body: JSON.stringify({ email: googleUser.email })
                        })
                        const response = await Flag.json();
                        if (response) {
                            const login = await fetch(`${APIURL}/auth/signin`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: googleUser.email,
                                    password: googleUser.sub,
                                })
                            })
                            const response = await login.json();

                            localStorage.setItem(
                                'userSession',
                                JSON.stringify({ token: response.token, user: response.user })
                            );
                            router.push('/Home');

                        }
                        if (!response) {
                            const register = await fetch(`${APIURL}/auth/signup/google`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: googleUser.email,
                                    password: googleUser.sub,
                                    name: googleUser.name,
                                    profileImageUrl: googleUser.picture,
                                    username: googleUser.nickname,
                                })
                            })
                            const response = await register.json();
                            if (!response) {
                                throw new Error('Error al registrar el usuario');
                            }
                            if (response) {
                                const login = await fetch(`${APIURL}/auth/signin`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        email: googleUser.email,
                                        password: googleUser.sub,
                                    })

                                })
                                const response = await login.json();
                                console.log('response login con register', response);
                                localStorage.setItem(
                                    'userSession',
                                    JSON.stringify({ token: response.token, user: response.user })
                                );
                                router.push('/Home');

                            }
                        }
                    }
                }
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                })
                throw new Error("Error al verificar el usuario de Google:" + error);
            }

        }
        handleGoogleLogin();
    }, [router]);

    return (

        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>

            {/* Texto */}
            <h2 className="text-xl font-semibold text-gray-700">
                Verificando credenciales...
            </h2>
        </div>
    );

}
