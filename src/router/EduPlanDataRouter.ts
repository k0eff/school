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
 * @method Get /eduPlanData by byEduPlanIdAndEduPlanDataId
 */
router.get(
  "/byEduPlanIdAndEduPlanDataId/:eduPlanId?/:eduPlanDataId?",
  (req: Request, res: Response) => {
    let eduPlanId: string = "";
    let eduPlanDataId: string = "";
    let promise: any;

    // get either all of EduPlanData based on given eduplan id and eduplandata id or just get all eduplandata
    if (!isEmpty(req.params.eduPlanId)) {
      if (!isEmpty(req.params.eduPlanDataId)) {
        eduPlanId = req.params.eduPlanId;
        eduPlanDataId = req.params.eduPlanDataId;
        promise = EduPlanData.find({ _id: eduPlanDataId, eduPlan: eduPlanId });
      } else {
        promise = EduPlanData.find();
      }
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
      .populate({
        path: "eduPlan"
      })

      .then(eduPlanDataResult => {
        res.json(eduPlanDataResult);
      })
      .catch(e => {
        res.status(400).json(e);
      });
  }
);

/**
 * @method Get /eduPlanData by EduPlanId
 */
router.get("/byEduPlanId/:id?", (req: Request, res: Response) => {
  let eduPlan: string = "";
  let promise: any;

  // get either all of EduPlanData or just a single one
  if (!isEmpty(req.params.id)) {
    eduPlan = req.params.id;
    promise = EduPlanData.find({ eduPlan });
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
    .populate({
      path: "eduPlan"
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
  let { classHours, classNumber, subject } = req.body;
  let eduPlan: any;
  if (req.params.id) {
    eduPlan = req.params.id;
  } else {
    eduPlan = new mongo.ObjectId();
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

    let data = { eduPlan, classNumber, subject, classHours };

    EduPlanData.findOneAndUpdate({ eduPlan }, data, { upsert: true })
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
