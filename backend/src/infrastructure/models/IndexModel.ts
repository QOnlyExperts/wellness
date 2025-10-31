import { ImplementModel } from "./ImplementModel";  
import { ImgModel } from "./ImgModel";
import { GroupImplementModel } from "./GroupImplementModel";

ImplementModel.hasMany(ImgModel, {foreignKey: "implement_id"});
ImgModel.belongsTo(ImplementModel, {foreignKey: "implement_id"});

GroupImplementModel.hasMany(ImplementModel, {
  foreignKey: "group_implement_id",
});
ImplementModel.belongsTo(GroupImplementModel, {
  foreignKey: "group_implement_id"
})


export { 
  GroupImplementModel,
  ImplementModel,
  ImgModel
};