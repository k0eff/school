import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ValueRelationSchema = new Schema(
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
    collection: "ValueRelation",
    timestamps: true
  }
);

const ValueRelationModel = mongoose.model("ValueRelation", ValueRelationSchema);
export default ValueRelationModel;
