export interface LoginOutputDto {
  user: { 
    id: number; 
    name: string; 
    email: string,
    rol: number;
    info_person_id: number | null;
  };
  token: string;
}
