export interface LoginOutputDto {
  user: { 
    id: number; 
    name: string; 
    email: string,
    rol: number;
  };
  token: string;
}
