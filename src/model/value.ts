import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ValueSchema: mongoose.Schema = new Schema(
  {
    paramId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Param"
    },

    value: {
      type: String,
      required: true
    },
    descr: {
      type: String,
      required: true
    }
  },
  {
    collection: "Value",
    timestamps: true
  }
);

const ValueModel = mongoose.model("Value", ValueSchema);
export default ValueModel;
