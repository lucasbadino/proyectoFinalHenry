import { NextFunction } from "express";

export function loggsGlobal(req: Request, res: Response, next: NextFunction){
    const dateActual = new Date();
    console.log(
        `Estas ejecutando un metodo ${req.method} en la ruta ${req.url}, en la fecha ${dateActual}`,
      );
      next();
}