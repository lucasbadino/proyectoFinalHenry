export interface IServiceProvider {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  age:number;
  phone:number;
  address:string;
  role:string;
  profileImageUrl: string;
  experience:string;
  calification:number;
  ubication:string;
  costPerHour:number;
  serviceProvided: [];
}

export interface IServiceProviderListProps {
  providers: IServiceProvider[];
}

export interface IProviderCardProps {
  name: string;
  profileImageUrl: string;
  experience:string;
  calification:number;
}
