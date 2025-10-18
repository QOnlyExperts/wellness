import { useState } from "react";

import GroupImplementListContainer from "../../containers/group-implement/GroupImplementListContainer";

const GroupImplementPage = () => {
  

    return(
    <div className='div-principal'>
      <h2>Listado de grupos de instrumentos</h2>
      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} children={ModalContent && <ModalContent id={id}/>}/> */}
      {/* <Tabs handleCategory={handleCategory}/> */}
      {/* <Head title={"Listado de producto"} textButton={"Crear producto"} to={'/admin/product/register'}/> */}
      <GroupImplementListContainer/>
    </div>
  )
}

export default GroupImplementPage;