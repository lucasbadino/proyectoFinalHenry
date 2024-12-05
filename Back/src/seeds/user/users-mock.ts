import { Role } from "src/modules/user/enums/role.enum";


export const usersMock = [
   
    {
        name: "Pepe",
        email: "pepe@gmail.com",
        username : "Pepito",
        password: "123456",
        passwordConfirm: "123456",
        phone: "51231532",
        address: "9 de Julio",
        age : 45,
        role : Role.User,
        isBanned:"false",
    },
    {
        name: "Martina",
        email: "martina@gmail.com",
        username : "LaMarti",
        password: "123456",
        passwordConfirm: "123456",
        phone: "55325467",
        address: "Giulio di cesare",
        age : 19,
        role : Role.User,
        isBanned:"false",
    },
]