import { ILoginErrors, ILoginProps } from "@/interfaces/ILoginProps";
import { IRegisterErrors, IRegisterProps } from "@/interfaces/IRegisterProps";

export const validateRegisterForm = (value: IRegisterProps): IRegisterErrors => {
    const tempErrors: IRegisterErrors = {};
    if (!value.name) {
        tempErrors.name = "El nombre es requerido.";
    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(value.name)) {
        tempErrors.name = "El nombre solo puede contener letras y espacios.";
    }
    if (!value.email) {
        tempErrors.email = "El email es requerido.";
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value.email)) {
        tempErrors.email = "Correo electrónico no válido.";
    } else if (/[A-Z]/.test(value.email)) { // Verifica si hay letras mayúsculas
        tempErrors.email = "El correo debe estar en minúsculas.";
    }
    if (!value.password) {
        tempErrors.password = "La contraseña es requerida.";
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(value.password)) {
        tempErrors.password = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un símbolo.";
    }    
    if (value.password !== value.passwordConfirm) {
        tempErrors.passwordConfirm = "Las contraseñas no coinciden.";
      }
    if (!value.phone) {
        tempErrors.phone = "El número de teléfono es requerido.";
    } else if (!/^\d+$/.test(value.phone)) {
        tempErrors.phone = "El número de teléfono solo puede contener números.";
    } else if (value.phone.length < 8 || value.phone.length > 15) {
        tempErrors.phone = "El número de teléfono debe tener entre 8 y 15 dígitos.";
    }
    if (!value.age) {
        tempErrors.age = "La edad es requerida.";
    } else {
        const ageValue = Number(value.age); // Convertimos age a número
        if (isNaN(ageValue) || ageValue <= 0) {  // Verificamos que sea un número válido
            tempErrors.age = "La edad debe ser un número positivo.";
        }
    }


    const age = Number(value.age);

    if (isNaN(age)) {
        tempErrors.age = "La edad debe ser un número válido";
    } else if (age < 18) {
        tempErrors.age = "La edad debe ser al menos 18 años";
    } else if (age > 150) {
        tempErrors.age = "La edad no puede ser mayor a 150 años";
    }
  if (!value.address) {
    tempErrors.address = "La dirección es requerida.";
  }

  if (!value.name) tempErrors.name = "El nombre es obligatorio.";
  if (!value.email) tempErrors.email = "El correo es obligatorio.";
  
    return tempErrors;
};


 export const validateLoginForm = (value: ILoginProps): ILoginErrors => {
    const tempErrors: IRegisterErrors = {};
    
     if (!value.password) {
         tempErrors.password = "La contraseña es requerida.";
     } 
    if (!value.email) {
        tempErrors.email = "El email es requerido.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.email)) {
        tempErrors.email = "Correo electrónico no registrado ";
    }
    
    return tempErrors;
}
