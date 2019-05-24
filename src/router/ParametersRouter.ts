import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import Value from "../model/params/value";
import Param from "../model/params/param";
import ValueRelation from "../model/params/ValueRelation";
import { Error } from "mongoose";
import isEmpty from "../utils/is-empty";

/**
 * @method Get /param data by id
 */
router.get("/param/id/:id", (req: Request, res: Response) => {
  let id: string = req.params.id;

  Param.find({ _id: id })
    .then(params => {
      res.json(params);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Get /params By Name
 */
router.get("/param/:name", (req: Request, res: Response) => {
  let name: string = req.params.name;

  Param.find({ name })
    .then(params => {
      res.json(params);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Get Value options by Param Name
 */

router.get("/value/paramName/:paramName", (req: Request, res: Response) => {
  let paramName: string = req.params.paramName;

  Param.find({ name: paramName }).then(items => {
    if (!isEmpty(items)) {
      // Check if there is a such a param Name
      let paramId: string = "";
      items.map(item => {
        paramId = item.id;
      });

      Value.find({ paramId: paramId })
        .populate("paramId")
        .then(params => {
          res.json(params);
        })
        .catch(e => {
          res.status(400).json(e);
        });
    } else {
      res.status(400).json({ error: "There is no such param" });
    }
  });
});

/**
 * @method Get Value options by ParamId
 */

router.get("/value/:paramId", (req: Request, res: Response) => {
  let paramId: string = req.params.paramId;

  Value.find({ paramId: paramId })
    .populate("paramId", "name")
    .then(params => {
      res.json(params);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Post /param
 */
router.post("/param", (req: Request, res: Response) => {
  let name: string = req.body.name;

  Param.find({ name }).then(items => {
    if (Array.isArray(items) && items.length > 0) {
      // Param with the same name exists

      res.status(400).json({ error: "Such a Param already exists" });
    } else {
      let param = new Param({
        name
      });
      param
        .save()
        .then(param => {
          res.json(param);
        })
        .catch((e: Error) => {
          res.status(400).json(e);
        });
    }
  });
});

/**
 * @method Post value option
 */
router.post("/value", (req: Request, res: Response) => {
  let { value, descr, paramId } = req.body;

  Param.find({ _id: paramId }).then(LTItem => {
    if (Array.isArray(LTItem) && LTItem.length > 0) {
      // If given paramId exists - proceed with logic

      Value.find({ paramId, value }).then(LItem => {
        if (Array.isArray(LItem) && LItem.length < 1) {
          // If given paramId and value DO NOT exist - proceed with logic. This means we will not make a duplicate value

          let newValue = new Value({
            value,
            descr,
            paramId
          })
            .save()
            .then(item => {
              res.json(item);
            })
            .catch(e => res.status(400).json(e));
        } else {
          res.status(400).json({
            error: "There already is a Value with the same value and paramId "
          });
        }
      });
    } else {
      res.status(400).json({ error: "Given paramId does not exist" });
    }
  });
});

/**
 * @method Post value option
 */
router.post("/valueByParamName", (req: Request, res: Response) => {
  let { value, descr, paramName } = req.body;

  Param.find({ name: paramName }).then(LTItem => {
    if (Array.isArray(LTItem) && LTItem.length > 0) {
      // If given paramId exists - proceed with logic

      let paramId = LTItem[0]._id;

      Value.find({ paramId, value }).then(LItem => {
        if (Array.isArray(LItem) && LItem.length < 1) {
          // If given paramId and value DO NOT exist - proceed with logic. This means we will not make a duplicate value

          let newValue = new Value({
            value,
            descr,
            paramId
          })
            .save()
            .then(item => {
              res.json(item);
            })
            .catch(e => res.status(400).json(e));
        } else {
          res.status(400).json({
            error: "There already is a Value with the same value and paramId "
          });
        }
      });
    } else {
      res.status(400).json({ error: "Given paramId does not exist" });
    }
  });
});

export default router;
