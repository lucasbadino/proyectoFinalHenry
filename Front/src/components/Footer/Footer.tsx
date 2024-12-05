import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#388E3C] to-[#2E7D32] text-white py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Información de contacto */}
        <div className="text-center lg:text-left space-y-2">
          <p className="text-xl font-bold">
            "Donde la naturaleza y el diseño se encuentran."
          </p>
          <ul className="text-sm space-y-1">
            <li>🌿 Ubicación: Av. Las Flores 1234, Ciudad Jardín</li>
            <li>📞 Teléfono: +54 9 11 1234-5678</li>
            <li>
              📧 Correo:{" "}
              <a
                href="mailto:hpfinal21@gmail.com"
                className="underline hover:text-gray-200"
              >
                hpfinal21@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Navegación */}
        <div className="text-center lg:text-left space-y-2">
          <p className="text-xl font-bold">
            Navega por nuestra pagína
          </p>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/servicios" className="hover:underline">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/sobreNosotros" className="hover:underline">
                Sobre Nosotros
              </Link>
            </li>

            <li>
              <Link href="/contacto" className="hover:underline">
                Enviar Sugerencia
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Redes sociales */}
      <div className="flex justify-center space-x-6 mt-4">
        {/* Facebook */}
        <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/LogosFacebook.webp"
            alt="Facebook"
            width={50}
            height={50}
            className="rounded-full hover:scale-110 transition-transform duration-300"
          />
        </Link>
        {/* Instagram */}
        <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/LogoInstagram.webp"
            alt="Instagram"
            width={50}
            height={50}
            className="rounded-full hover:scale-110 transition-transform duration-300"
          />
        </Link>
        {/* WhatsApp */}
        <Link href="https://wa.me/5492944777103" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/LogosWhatsappIcon.webp"
            alt="WhatsApp"
            width={50}
            height={50}
            className="rounded-full hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Derechos reservados */}
      <div className="text-center mt-4">
        <p className="font-medium text-sm">
          &copy; 2010 Vicnasol. Todos los derechos reservados.
        </p>
        <p className="mt-2 text-xs text-gray-300">
          Creado con ❤️ por Vicnasol Team
        </p>
      </div>
    </footer>
  );
}



// import Link from "next/link";
// import Image from "next/image";

// export default function Footer() {
//   return (
//     <footer className="bg-[#4CAF50] text-white py-8 px-4">
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
//         {/* Información de contacto */}
//         <ul className="text-center lg:text-left">
//           <li className="text-lg py-2">
//             Transformando espacios verdes, cuidando cada detalle.
//           </li>
//           <li className=" text-sm py-1">
//             🌿 Ubicación: Av. Las Flores 1234, Ciudad Jardín, Provincia Verde
//           </li>
//           <li className="text-sm py-1">
//             📞 Teléfono: +54 9 11 1234-5678
//           </li>
//           <li className="text-sm py-1">
//             📧 Correo electrónico: contact@vicnasol.com
//           </li>
//         </ul>

//         {/* Derechos reservados */}
//         <p className="text-center font-medium text-base lg:text-lg">
//           &copy; 2010 Vicnasol. Todos los derechos reservados.
//         </p>

//         {/* Redes sociales */}
//         <ul className="flex justify-center space-x-6 lg:justify-middle">
//           {/* Facebook */}
//           <li className="transform transition-transform duration-300 hover:scale-110">
//             <Link
//               href="https://www.facebook.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Image
//                 src={"/images/LogosFacebook.webp"}
//                 alt="Facebook"
//                 width={40}
//                 height={40}
//                 className="rounded-full mx-auto"
//               />
//               <span className="text-sm mt-2 block text-center">
//                 Facebook
//               </span>
//             </Link>
//           </li>

//           {/* Instagram */}
//           <li className="transform transition-transform duration-300 hover:scale-110">
//             <Link
//               href="https://www.instagram.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Image
//                 src={"/images/LogoInstagram.webp"}
//                 alt="Instagram"
//                 width={40}
//                 height={40}
//                 className="rounded-full mx-auto"
//               />
//               <span className="text-sm mt-2 block text-center">
//                 Instagram
//               </span>
//             </Link>
//           </li>

//           {/* WhatsApp */}
//           <li className="transform transition-transform duration-300 hover:scale-110">
//             <Link
//               href="https://wa.me/5492944777103?text=Hello, I want information about your business"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Image
//                 src={"/images/LogosWhatsappIcon.webp"}
//                 alt="WhatsApp"
//                 width={40}
//                 height={40}
//                 className="rounded-full mx-auto"
//               />
//               <span className="text-sm mt-2 block text-center">
//                 WhatsApp
//               </span>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </footer>
//   );
// }
