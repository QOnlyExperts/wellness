
export interface GroupImplementOutputDto {
  id: number | null,
  prefix: string,
  name: string,
  amount: number,
  max_hours: number,
  time_limit: number
  images_preview: string[]
}