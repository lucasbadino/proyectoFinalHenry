// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { IServiceErrors, IServiceProps } from "@/interfaces/IServiceProps";
// import { validateServiceForm } from "@/helpers/validateService";
// import { registerService } from "@/helpers/auth.helpers";
// import { Categories } from "./enums/categories.enum";

// export default function RegisterServiceForm() {
//   const router = useRouter();

//   const categories = Object.values(Categories);

//   const initialState: IServiceProps = {
//     detailService: "",
//     price: 0,
//     categories: [],
//   };

//   const [dataService, setDataService] = useState<IServiceProps>(initialState);
//   const [errors, setErrors] = useState<IServiceErrors>({});
//   const [touched, setTouched] = useState({
//     detailService: false,
//     price: false,
//     categories: false,
//   });

//   // Manejo de cambios en los campos del formulario
//   const handleChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = event.target;

//     setDataService({
//       ...dataService,
//       [name]: type === "number" ? Number(value) : value,
//     });
//     setTouched({
//       ...touched,
//       [name]: true,
//     });
//   };

//   // Manejo del cambio en las categorías (checkboxes)
//   const handleCategoriesChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value, checked } = event.target;
//     if (checked) {
//       setDataService({
//         ...dataService,
//         categories: [...dataService.categories, value],
//       });
//     } else {
//       setDataService({
//         ...dataService,
//         categories: dataService.categories.filter(
//           (category) => category !== value
//         ),
//       });
//     }
//   };

//   // Manejo del envío del formulario
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const validationErrors = validateServiceForm(dataService);
//     setErrors(validationErrors);

//     // Si no hay errores, enviamos el servicio
//     if (Object.keys(validationErrors).length === 0) {
//       await registerService(dataService);
//       alert("Servicio agregado con éxito");
//       router.push("/Home"); // Redirigir a la lista de servicios
//     }
//   };

//   // Validación en tiempo real
//   useEffect(() => {
//     if (Object.values(touched).some((field) => field)) {
//       const validationErrors = validateServiceForm(dataService);
//       setErrors(validationErrors);
//     }
//   }, [dataService, touched]);

//   return (
//     <div className="w-full max-w-md mx-auto mt-24 p-6 border rounded-lg shadow-lg bg-white">
//       <h2 className="text-2xl font-bold text-center mb-4 text-green-700">Agregar un Servicio de Jardinería</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="detailService" className="block text-sm font-medium text-gray-700">Detalle del Servicio</label>
//           <input
//             id="detailService"
//             name="detailService"
//             required
//             value={dataService.detailService}
//             onChange={handleChange}
//             placeholder="Por ej., cortar el césped"
//             className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-700"
//           />
//           {touched.detailService && errors.detailService && (
//             <span className="text-red-500 text-sm">{errors.detailService}</span>
//           )}
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
//           <input
//             id="price"
//             name="price"
//             type="number"
//             step="0.01"
//             required
//             value={dataService.price}
//             onChange={handleChange}
//             placeholder="50.00"
//             className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-700"
//           />
//           {touched.price && errors.price && (
//             <span className="text-red-500 text-sm">{errors.price}</span>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Categorías</label>
//           <div className="mt-2 space-y-2">
//             {categories.map((category) => (
//               <div key={category} className="flex items-center">
//                 <input
//                   id={category}
//                   name="categories"
//                   type="checkbox"
//                   value={category}
//                   onChange={handleCategoriesChange}
//                   className="h-4 w-4 text-green-700 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor={category}
//                   className="ml-2 block text-sm text-gray-700"
//                 >
//                   {category}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {touched.categories && errors.categories && (
//             <span className="text-red-500 text-sm">{errors.categories}</span>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={Object.values(errors).some((error) => error !== '')}
//           className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//         >
//           Agregar Servicio
//         </button>
//       </form>
//     </div>
//   );
// }
