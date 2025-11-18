

export interface RegisterUserOutputDto {
  user: {
    id: number,
    email: string,
    rol_id: number
  },
  info_person: {
    full_name: string
  },
  token: string
  // info_person: CreateInfoPersonOutputDto;
}