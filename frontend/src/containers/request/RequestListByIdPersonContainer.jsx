import React, { useEffect, useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import moment from "moment";
import RequestService from "../../services/RequestService";
import RequestIcon from "../../components/icons/Request";

import './RequestListByIdPersonContainer.css'

const apiUrl = import.meta.env.VITE_API_URL;

const RequestListByIdPersonContainer = ({requestList, isLoading, error}) => {

  const getImgUrl = (request) => {
    const imgPath = request?.implement?.imgs?.[0]?.description;
    if (!imgPath) return null;
    return `${apiUrl}:4000/${imgPath}`;
  };

  const formatDate = (date) =>
    date ? moment(date).format("DD/MM/YYYY hh:mm a") : "-";

  if (isLoading) {
    return (
      <div className="empty-state">
        Cargando implementos usados...
        <RequestIcon color="#000000" />
      </div>
    );
  }

  if (error) {
    return <div className="empty-state">Error al cargar implementos usados: {error}</div>;
  }

  if (requestList.length === 0) {
    return (
      <div className="empty-state">
        No se encontraron implementos usados.
        <RequestIcon color="#000000" />
      </div>
    );
  }

  return (
    <div className="request-list-pro">
      {requestList.map((request, index) => {
        const imgUrl = getImgUrl(request);

        return (
          <div key={index} className="request-card-pro">
            <div className="card-pro-img">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="Implemento"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder-url-por-defecto";
                  }}
                />
              ) : (
                <div className="card-pro-img-fallback">Sin imagen</div>
              )}
            </div>

            <div className="card-pro-body">
              <div className="card-pro-title">
                {request?.implement?.groupImplement?.name || "-"}
              </div>

              <div className="card-pro-grid">
                <div><strong>Código:</strong> {request?.implement?.cod || "-"}</div>
                <div>
                  <strong>Tiempo:</strong>{" "}
                  {request.duration_hours ? `${parseInt(request.duration_hours)} h` : "-"}
                </div>
                <div><strong>Inicio:</strong> {formatDate(request.created_at)}</div>
                <div><strong>Fin:</strong> {formatDate(request.finished_at)}</div>
                <div><strong>Límite:</strong> {formatDate(request.limited_at)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestListByIdPersonContainer;
