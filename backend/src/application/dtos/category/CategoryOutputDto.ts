// Este DTO (Data Transfer Object) define la estructura de datos que la API 
// expondrá públicamente para una categoría. Se basa en la entidad de dominio.
export interface CategoryOutputDto {
  id: number | null;
  name: string;
  description: string | null;
}