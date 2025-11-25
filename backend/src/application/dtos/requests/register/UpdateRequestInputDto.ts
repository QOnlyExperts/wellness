import { ImplementStatus } from "../../../../domain/enums/ImplementStatus";
import { RequestStatus } from "../../../../domain/enums/RequestStatus";


export interface UpdateRequestInputDto{
  request_id: number;
  status: RequestStatus,
  limited_at: Date,
  implement_id: number;
  implement_status: ImplementStatus
}
  