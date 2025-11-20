import { RequestStatus } from "../enums/RequestStatus"
import { ImplementEntity } from "./ImplementEntity";
import { InfoPersonEntity } from "./InfoPersonEntity";


export class RequestEntity {
  public readonly id: number | null;
  public status: RequestStatus;
  public created_at: Date;
  public finished_at: Date | null;
  public limited_at: Date;

  public info_person_id: number;
  public implement_id: number;

  public info_person?: InfoPersonEntity
  public implement?: ImplementEntity

  constructor(props: {
    id: number | null;
    status: RequestStatus;
    created_at: Date;
    finished_at: Date | null;
    limited_at: Date;
    info_person_id: number;
    implement_id: number;

    info_person?: InfoPersonEntity
    implement?: ImplementEntity
  }) {
    this.id = props.id;
    this.status = props.status;
    this.created_at = props.created_at;
    this.finished_at = props.finished_at;
    this.limited_at = props.limited_at
    this.info_person_id = props.info_person_id;
    this.implement_id = props.implement_id;
    this.info_person = props.info_person;
    this.implement = props.implement;
  }
  static create(props: {
    id: number | null;
    status: RequestStatus;
    created_at: Date;
    finished_at: Date | null;
    limited_at: Date;
    info_person_id: number;
    implement_id: number;
  }): RequestEntity {
    return new RequestEntity({
      id: props.id,
      status: props.status,
      created_at: props.created_at,
      finished_at: props.finished_at,
      limited_at: props.limited_at,
      info_person_id: props.info_person_id,
      implement_id: props.implement_id
    });
  }
  // Lógica de Dominio: (Métodos que aplican reglas)
  public canBeDeactivated(): boolean {
    // Ejemplo de lógica de negocio en la entidad
    return this.status !== RequestStatus.FINISHED;
  }

  

}