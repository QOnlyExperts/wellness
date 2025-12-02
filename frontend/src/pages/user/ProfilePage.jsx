import { useState } from "react"

import './ProfilePage.css'
import RequestListByIdPersonContainer from "../../containers/request/RequestListByIdPersonContainer";
import Head from "../../components/shared/Head";
import { useRequestByIdPerson } from "../../hooks/useRequestByIdPerson";


const ProfilePage = () => {

  const [user, setUser] = useState(() => {
    // 1. Obtener el ítem (puede ser null)
    const dataJson = sessionStorage.getItem("data");

    // 2. Si no hay datos, retorna null o un valor por defecto (ej. 0 o -1)
    if (!dataJson) {
      return null;
    }

    // 3. Parsear el JSON. Usamos try/catch si el JSON puede estar malformado.
    try {
      const data = JSON.parse(dataJson);
      // 4. Devolver la propiedad, si existe
      return data.user || null;
    } catch (e) {
      // En caso de que el JSON no sea válido
      console.error("Error parsing data from session storage:", e);
      return null;
    }
  });

  const {requestList, hours, loading, error} = useRequestByIdPerson({infoPersonId: user.info_person_id});



  return(
    <div className="div-principal-profile">
      <div className="content-avatar">
        <div className="avatar">
          <h3>{user.name.charAt(0)}</h3>
        </div>

      </div>
      <div className="fullname">
        <h3>{user.name}</h3>
      </div>
      <div className="content-data">
        <div>
          <h3>Correo institucional</h3>
          <span>{user.email}</span>
        </div>
        <div>
          <h3>N. Horas</h3>
          <span>{hours}</span>
        </div>
      </div>
      <Head 
        title="Implementos usados"
        subTitle="Contiene los implementos usados con sus horas y las fechas asignadas"
      />
      <RequestListByIdPersonContainer requestList={requestList} isLoading={loading} error={error} />
    </div>
  )
}

export default ProfilePage;