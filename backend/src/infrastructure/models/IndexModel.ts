import { ImplementModel } from "./ImplementModel";  
import { RequestModel } from "./RequestModel";
import { ImgModel } from "./ImgModel";
import { GroupImplementModel } from "./GroupImplementModel";
import { ProgramModel } from "./ProgramModel";
import { LoginModel } from "./LoginModel";
import { InfoPersonModel } from "./InfoPersonModel";

import { RoleModel } from "./RoleModel";

// import 
InfoPersonModel.hasMany(RequestModel, { foreignKey: "info_person_id" });
RequestModel.belongsTo(InfoPersonModel, { foreignKey: "info_person_id" });

ImplementModel.hasMany(RequestModel, { foreignKey: "implement_id" });
RequestModel.belongsTo(ImplementModel, { foreignKey: "implement_id" });

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

InfoPersonModel.belongsTo(ProgramModel, {
  foreignKey: "program_id",
  // as: "program",
});

ProgramModel.hasMany(InfoPersonModel, {
  foreignKey: "program_id",
  // as: "infoPerson",
});

RoleModel.hasOne(LoginModel, {
  foreignKey: "rol_id",
  // sourceKey: "id"
});

LoginModel.belongsTo(RoleModel, {
  foreignKey: "rol_id",
  // targetKey: "id"
});

export { 
  GroupImplementModel,
  ImplementModel,
  RequestModel,
  ImgModel,
  LoginModel,
  InfoPersonModel,
  ProgramModel
};