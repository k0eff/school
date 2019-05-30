import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import EduPlan from "../model/eduPlans/eduPlan";
import EduPlanData from "../model/eduPlans/eduPlanData";

import Value from "../model/params/value";
import Param from "../model/params/param";

import paramNameValueValidator, {
  paramNameValueResultType,
  NameValueType
} from "../helper/paramNameValueValidator";

import { Error, Mongoose, mongo } from "mongoose";
import isEmpty from "../utils/is-empty";

/**
 * @method Get /eduPlan By Id
 */
router.get("/eduPlan/:id?", (req: Request, res: Response) => {
  let id: string = "";
  let promise;
  if (req.params.id) {
    id = req.params.id;
    promise = EduPlan.find({ _id: id });
  } else {
    promise = EduPlan.find();
  }

  promise
    .populate({
      path: "classLetter",
      populate: { path: "paramId" }
    })
    .populate({
      path: "schoolingYear",
      populate: { path: "paramId" }
    })

    .then(eduPlanResult => {
      res.json(eduPlanResult);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Post /eduPlan By Id
 */
router.post("/eduPlan/:id?", (req: Request, res: Response) => {
  let { name, schoolingYear, classLetter } = req.body;
  let id;
  if (!isEmpty(req.params.id)) {
    id = req.params.id;
  } else {
    id = new mongo.ObjectId();
  }

  //gather all paramNameValuePairs that need to be validated

  let toBeValidated: Array<NameValueType> = [
    { valueId: schoolingYear, name: "schoolingYear" },
    { valueId: classLetter, name: "classLetter" }
  ];

  // validate NameValue
  let validator = new paramNameValueValidator(toBeValidated);

  let isValid = validator.areAllValid();
  if (isValid) {
    //nameValues are valid. we can insert/update now

    let data = { name, schoolingYear, classLetter };

    EduPlan.findOneAndUpdate({ _id: id }, data, { upsert: true })
      .then(() => res.json({ success: true }))
      .catch((e: Error) => res.status(400).json(e));
  } else {
    //nameValues are invalid
    res.status(400).json({
      error: "Invalid data supplied",
      data: validator.invalid
    });
  }
});

export default router;
