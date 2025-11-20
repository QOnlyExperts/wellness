
import UserHeadContainer from "../../containers/users/UserHeadContainer";
import UserListContainer from "../../containers/users/UserListContainer";
import UserStatsContainer from "../../containers/users/UserStatsContainer";


const UserPage = () => {

  return (    
    <div className="div-principal">
      <UserHeadContainer />
      <UserStatsContainer />
      <UserListContainer />
    </div>
  );
}

export default UserPage;