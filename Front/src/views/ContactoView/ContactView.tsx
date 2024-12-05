"use client"

import { useState } from 'react';
import Swal from 'sweetalert2';
const APIURL = process.env.NEXT_PUBLIC_API_URL;

const ContactView = () => {
  const [formData, setFormData] = useState({ email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 
    setLoading(true); 
    setSuccess(false); 
    try {
      const response = await fetch(`${APIURL}/mail/send`, {
        method: 'POST',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify(formData), 
      });
  
      console.log("response", response);
      
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Error al enviar el correo.');
      }
  
      setSuccess(true); 
      setFormData({ email: '', phone: '', message: '' }); 
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Gracias por tus sugerencias. Nos pondremos en contacto contigo pronto.',
      });
    } catch (error: any) {
      console.error('Error al enviar el correo:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar el correo',
        text: error.message,
      })
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <div className="min-h-screen grid grid-cols-1 place-items-center lg:grid-cols-2 bg-[url('/images/fondo_contacto.webp')] bg-cover bg-center pt-16 lg:pt-24">
      <div className="container bg-white m-auto mt-8 p-4 max-w-full shadow-sm rounded-sm lg:m-2 lg:p-8 lg:max-w-lg lg:shadow-lg lg:rounded-lg">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-[#263238]">Sugerencias</h2>
        <p className="mb-6 text-[#263238] text-center font-nunito text-sm lg:text-lg">
          Por favor llene el formulario para enviar tus sugerencias.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-base font-medium text-[#263238] font-roboto">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              className="mt-1 p-3 block w-full border border-[#388E3C] rounded-md shadow-sm focus:ring-[#388E3C] focus:border-[#388E3C]"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-base font-medium text-[#263238] font-roboto">
              Teléfono:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Introduce tu número de teléfono"
              className="mt-1 p-3 block w-full border border-[#388E3C] rounded-md shadow-sm focus:ring-[#388E3C] focus:border-[#388E3C]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-base font-medium text-[#263238] font-roboto">
              Mensaje:
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Introduce tu mensaje"
              className="mt-1 p-3 block w-full border border-[#388E3C] rounded-md shadow-sm focus:ring-[#388E3C] focus:border-[#388E3C] h-32"
              style={{ resize: 'none' }}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 p-2 bg-[#4CAF50] text-white font-bold rounded hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-[#388E3C]"
          >
            {loading ? 'Enviando...' : 'ENVIAR'}
          </button>
        </form>
        {success && <p className="mt-4 text-center text-green-600">¡Correo enviado con éxito!</p>}
      </div>
    </div>
  );
};

export default ContactView;
