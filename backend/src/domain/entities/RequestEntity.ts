import { ValidationError } from "../../shared/errors/DomainErrors";
import { RequestStatus } from "../enums/RequestStatus";
import { ImplementEntity } from "./ImplementEntity";
import { InfoPersonEntity } from "./InfoPersonEntity";

export class RequestEntity {
  public readonly id: number | null;
  public status: RequestStatus;

  // Se almacenan como string (ISO), pero se consumen como Date
  public created_at: string;
  public finished_at: string | null;
  public limited_at: string | null;

  public duration_hours: number;

  public info_person_id: number;
  public implement_id: number;

  public info_person?: InfoPersonEntity;
  public implement?: ImplementEntity;

  constructor(props: {
    id: number | null;
    status: RequestStatus;
    created_at: string;
    finished_at: string | null;
    limited_at: string | null;
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
    created_at: string;
    finished_at: string | null;
    limited_at: string | null;
    duration_hours: number;
    info_person_id: number;
    implement_id: number;
  }): RequestEntity {
    return new RequestEntity(props);
  }

  public getStatus(): RequestStatus {
    return this.status;
  }

  /**
   * Calcula la duración entre created_at y limited_at.
   * Retorna { horas, minutos } o null si falta información.
   */
  getDuration() {
    if (!this.created_at || !this.limited_at) return null;

    const created = new Date(this.created_at);
    const limit = new Date(this.limited_at);

    if (isNaN(created.getTime()) || isNaN(limit.getTime())) return null;

    const diffMs = limit.getTime() - created.getTime();
    if (diffMs < 0) return { horas: 0, minutos: 0 };

    const totalHoras = diffMs / (1000 * 60 * 60);

    const horas = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras % 1) * 60);

    return { horas, minutos };
  }

  /**
   * Transición: REQUESTED -> ACCEPTED
   */
  public accept(implementId: number): void {
    if (this.status !== RequestStatus.REQUESTED) {
      throw new ValidationError(
        `No se puede aceptar. La solicitud está en estado: ${this.status}.`
      );
    }

    if (!implementId) {
      throw new ValidationError(
        "El ID del implemento es obligatorio para aceptar la solicitud."
      );
    }

    this.status = RequestStatus.ACCEPTED;
    this.implement_id = implementId;
  }

  /**
   * Transición: REQUESTED -> REFUSED
   */
  public refuse(): void {
    if (this.status !== RequestStatus.REQUESTED) {
      throw new ValidationError(
        `No se puede rechazar. Estado actual: ${this.status}.`
      );
    }

    this.status = RequestStatus.REFUSED;
  }

  /**
   * Transición: ACCEPTED -> FINISHED
   */
  public finish(): void {
    if (this.status !== RequestStatus.ACCEPTED) {
      throw new ValidationError(
        `Solo se puede finalizar una solicitud aceptada. Estado actual: ${this.status}.`
      );
    }

    // Fecha segura para MySQL
    const now = new Date();
    this.finished_at = now.toISOString().slice(0, 19).replace('T', ' ');

    this.status = RequestStatus.FINISHED;

    // Calculo de horas
    const fechaInicio = new Date(this.created_at);
    const fechaFin = new Date(this.finished_at);

    const diffMs = fechaFin.getTime() - fechaInicio.getTime();
    const totalHoras = diffMs / (1000 * 60 * 60);

    if (totalHoras < 1) this.duration_hours = 0;
    else if (totalHoras < 2) this.duration_hours = 1;
    else this.duration_hours = 2;
  }

}
