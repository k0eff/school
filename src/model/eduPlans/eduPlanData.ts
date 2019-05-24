import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EduPlanDataSchema = new Schema(
  {
    eduPlan: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "EduPlan"
    },
    classNumber: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Value"
    },

    subject: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Value"
    },
    classHours: {
      type: Schema.Types.Number,
      required: true
    }
  },
  {
    collection: "EduPlanData",
    timestamps: true
  }
);

const EduPlanDataModel = mongoose.model("EduPlanData", EduPlanDataSchema);
export default EduPlanDataModel;
