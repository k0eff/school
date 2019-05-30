import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import Data from "../model/eduPlans/eduPlan";
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
 * @method Get /eduPlanData By Id
 */
router.get("/:id?", (req: Request, res: Response) => {
  let id: string = "";
  let promise: any;

  // get either all of EduPlanData or just a single one
  if (req.params.id) {
    id = req.params.id;
    promise = EduPlanData.find({ _id: id });
  } else {
    promise = EduPlanData.find();
  }

  promise
    .populate({
      path: "classNumber",
      populate: { path: "paramId" }
    })
    .populate({
      path: "subject",
      populate: { path: "paramId" }
    })

    .then(eduPlanDataResult => {
      res.json(eduPlanDataResult);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Post /eduPlanData By Id
 */
router.post("/:id?", (req: Request, res: Response) => {
  let { name, classNumber, subject } = req.body;
  let id: any;
  if (req.params.id) {
    id = req.params.id;
  } else {
    id = new mongo.ObjectId();
  }

  //gather all paramNameValuePairs that need to be validated

  let toBeValidated: Array<NameValueType> = [
    { valueId: classNumber, name: "classNumber" },
    { valueId: subject, name: "subject" }
  ];

  // validate NameValue
  let validator = new paramNameValueValidator(toBeValidated);

  let isValid = validator.areAllValid();
  if (isValid) {
    //nameValues are valid. we can insert/update now

    let data = { name, classNumber, subject };

    EduPlanData.findOneAndUpdate({ _id: id }, data, { upsert: true })
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
