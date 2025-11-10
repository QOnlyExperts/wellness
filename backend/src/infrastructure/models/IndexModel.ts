import { ImplementModel } from "./ImplementModel";  
import { ImgModel } from "./ImgModel";
import { GroupImplementModel } from "./GroupImplementModel";

import { LoginModel } from "./LoginModel";
import { InfoPersonModel } from "./InfoPersonModel";

// import 

ImplementModel.hasMany(ImgModel, {foreignKey: "implement_id"});
ImgModel.belongsTo(ImplementModel, {foreignKey: "implement_id"});

GroupImplementModel.hasMany(ImplementModel, {
  foreignKey: "group_implement_id",
});
ImplementModel.belongsTo(GroupImplementModel, {
  foreignKey: "group_implement_id"
})

LoginModel.belongsTo(InfoPersonModel, {
  foreignKey: "info_person_id",
  // as: "infoPerson",
});

InfoPersonModel.hasOne(LoginModel, {
  foreignKey: "info_person_id",
  // as: "login",
});

export { 
  GroupImplementModel,
  ImplementModel,
  ImgModel,
  LoginModel,
  InfoPersonModel
};