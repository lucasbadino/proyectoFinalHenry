import { IServiceErrors, IServiceProps } from "@/interfaces/IServiceProps";

export const validateServiceForm = (value: IServiceProps): IServiceErrors => {
    const tempErrors: IServiceErrors = {};
  
    if (!value.detailService) {
      tempErrors.detailService = "El detalle del servicio es requerido.";
    } else if (value.detailService.length < 10) {
      tempErrors.detailService = "El detalle debe tener al menos 10 caracteres.";
    }
  
    if (value.price <= 0 || isNaN(Number(value.price))) {
      tempErrors.price = "El precio debe ser un número positivo.";
    }
  
    if (value.categories.length === 0) {
      tempErrors.categories = "Debes seleccionar al menos una categoría.";
    }
  
    return tempErrors;
  };
  