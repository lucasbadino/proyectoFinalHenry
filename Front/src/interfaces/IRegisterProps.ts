export interface IRegisterProps {

  name: string
  username: string;
  email: string
  password: string
  passwordConfirm: string
  phone: string
  age: number | string
  address: string
  role: string,
}

export interface IRegisterErrors {
  name?: string
  username?: string
  email?: string
  password?: string
  passwordConfirm?: string
  phone?: string
  age?: string
  address?: string
  role?:string
}

