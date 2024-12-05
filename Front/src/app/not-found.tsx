"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PageNotFound() {
    const router = useRouter();

    return (
        <div className="bg-[#263238] text-white min-h-screen flex flex-col justify-center items-center">
            <div className="container px-6 py-12 mx-auto text-center">
                <h1 className="text-6xl font-extrabold text-[#4CAF50]">
                    404
                </h1>
                <p className="mt-4 text-xl font-medium text-[#8BC34A]">
                    ¡Oops! La página que buscas no existe.
                </p>
                <p className="mt-2 text-lg text-[#FFEB3B]">
                    Es posible que la URL esté incorrecta o que esta página haya sido movida.
                </p>

                <div className="flex justify-center mt-6 gap-4">
                    <button
                        className="flex items-center justify-center px-5 py-2 text-sm font-bold text-white transition-colors duration-200 bg-[#388E3C] rounded-lg hover:bg-[#CDDC39]"
                        onClick={() => router.back()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 rtl:rotate-180"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                            />
                        </svg>
                        <span>Regresar</span>
                    </button>

                    <button
                        className="px-5 py-2 text-sm font-bold text-white transition-colors duration-200 bg-[#FF5722] rounded-lg hover:bg-[#4CAF50]"
                        onClick={() => router.push("/")}
                    >
                        Ir al inicio
                    </button>
                </div>
            </div>

            <div className="relative w-full max-w-2xl mt-12">
                <Image
                    src="/images/404.webp"
                    alt="Imagen de jardinería"
                    className="w-full h-auto rounded-lg shadow-lg"
                    width={1920}
                    height={1080}
                />
            </div>
        </div>
    );
}
