import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: "ListType",
    timestamps: true
  }
);

const ListTypeModel = mongoose.model("ListType", ListTypeSchema);
export default ListTypeModel;
