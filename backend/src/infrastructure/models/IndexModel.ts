import { ImplementModel } from "./ImplementModel";  
import { GroupImplementModel } from "./GroupImplementModel";


GroupImplementModel.hasMany(ImplementModel, {
  foreignKey: "group_implement_id",
});
ImplementModel.belongsTo(GroupImplementModel, {
  foreignKey: "group_implement_id"
})


export { 
  GroupImplementModel,
  ImplementModel
};