import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListSchema: mongoose.Schema = new Schema(
  {
    listTypeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ListType"
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
    collection: "List"
  }
);

const ListModel = mongoose.model("List", ListSchema);
export default ListModel;
