export interface IServiceProps {
    detailService: string;
    price: number;
    categories: string[]; 
}

export interface IServiceErrors {
    detailService?: string;
    price?: string; 
    categories?: string; 
  }