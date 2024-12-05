import { Role } from "src/modules/user/enums/role.enum";


export const adminMock = [
    {
        name: "Administrador",
        email: "admin@gmail.com",
        username : "Leonidas",
        password: "123456",
        passwordConfirm: "123456",
        phone: "5566443",
        address: "La administradora 123",
        age : 22,
        role : Role.Admin,
    },
    {
        name: "Admin2",
        email: "admin2@gmail.com",
        username : "Jasmin",
        password: "123456",
        passwordConfirm: "123456",
        phone: "362588895",
        address: "El admin Crack 123",
        age : 28,
        role : Role.Admin,
    }

]