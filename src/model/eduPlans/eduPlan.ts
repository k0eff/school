import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EduPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    schoolingYear: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Value"
    },

    classLetter: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Value"
    }
  },
  {
    collection: "EduPlan",
    timestamps: true
  }
);

const EduPlanModel = mongoose.model("EduPlan", EduPlanSchema);
export default EduPlanModel;
