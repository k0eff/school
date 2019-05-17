import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ParamSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: "Param",
    timestamps: true
  }
);

const ParamModel = mongoose.model("Param", ParamSchema);
export default ParamModel;
