import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListRelationSchema = new Schema(
  {
    LeftRel: {
      type: Schema.Types.ObjectId,
      required: true
    },
    RightRel: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    collection: "ListRelation"
  }
);

const ListRelationModel = mongoose.model("ListRelation", ListRelationSchema);
export default ListRelationModel;
