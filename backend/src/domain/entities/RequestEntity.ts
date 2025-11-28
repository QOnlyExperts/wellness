import { ValidationError } from "../../shared/errors/DomainErrors";
import { RequestStatus } from "../enums/RequestStatus";
import { ImplementEntity } from "./ImplementEntity";
import { InfoPersonEntity } from "./InfoPersonEntity";

export class RequestEntity {
  public readonly id: number | null;
  public status: RequestStatus;
  public created_at: Date;
  public finished_at: Date | null;
  public limited_at: Date | null;
  public duration_hours: number;

  public info_person_id: number;
  public implement_id: number;

  public info_person?: InfoPersonEntity;
  public implement?: ImplementEntity;

  constructor(props: {
    id: number | null;
    status: RequestStatus;
    created_at: Date;
    finished_at: Date | null;
    limited_at: Date | null;
    duration_hours: number;

    info_person_id: number;
    implement_id: number;

    info_person?: InfoPersonEntity;
    implement?: ImplementEntity;
  }) {
    this.id = props.id;
    this.status = props.status;
    this.created_at = props.created_at;
    this.finished_at = props.finished_at;
    this.limited_at = props.limited_at;
    this.duration_hours = props.duration_hours;
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
    limited_at: Date | null;
    duration_hours: number;

    info_person_id: number;
    implement_id: number;
  }): RequestEntity {
    return new RequestEntity({
      id: props.id,
      status: props.status,
      created_at: props.created_at,
      finished_at: props.finished_at,
      limited_at: props.limited_at,
      duration_hours: props.duration_hours,
      info_person_id: props.info_person_id,
      implement_id: props.implement_id,
    });
  }

  public getStatus(): RequestStatus {
    return this.status;
  }

  public accept(implementId: number): void {
    // Validación de Guarda (Guard Clause)
    if (this.status !== RequestStatus.REQUESTED) {
      throw new ValidationError(
        `No se puede aceptar. La solicitud ya se encuentra en estado: ${this.status}.`
      );
    }

    // Validación de datos contextuales
    if (!implementId) {
      throw new ValidationError(
        "El ID de implementación es obligatorio para aceptar la solicitud."
      );
    }

    // Ejecución de la Transición
    this.status = RequestStatus.ACCEPTED;
    this.implement_id = implementId;
    // Opcional: Asignar this.acceptedAt = new Date();
  }

  /**
   * Transición: REQUESTED -> REFUSED
   */
  public refuse(): void {
    // Validación de Guarda
    if (this.status !== RequestStatus.REQUESTED) {
      throw new ValidationError(
        `No se puede rechazar. La solicitud ya se encuentra en estado: ${this.status}.`
      );
    }

    // Ejecución de la Transición
    this.status = RequestStatus.REFUSED;
    // Opcional: Asignar this.refusedAt = new Date();
  }

  /**
   * Transición: ACCEPTED -> FINISHED
   */
  public finish(): void {
    // Validación de Guarda
    if (this.status !== RequestStatus.ACCEPTED) {
      throw new ValidationError(
        `Solo se puede finalizar una solicitud aceptada. Estado actual: ${this.status}.`
      );
    }

    // Ejecución de la Transición
    this.status = RequestStatus.FINISHED;
    // Opcional: Asignar this.finishedAt = new Date();
  }
}
