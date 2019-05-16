import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import List from "../model/list";
import ListType from "../model/listType";
import ListRelation from "../model/listRelation";
import { Error } from "mongoose";

/**
 * @method Get List Type data by id
 */
router.get("/type/id/:id", (req: Request, res: Response) => {
  let id: string = req.params.id;

  ListType.find({ _id: id })
    .then(listTypes => {
      res.json(listTypes);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Get List Types By Name
 */
router.get("/type/:name", (req: Request, res: Response) => {
  let name: string = req.params.name;

  ListType.find({ name })
    .then(listTypes => {
      res.json(listTypes);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Get List options by ListType Name
 */

router.get(
  "/list/listTypeName/:listTypeName",
  (req: Request, res: Response) => {
    let listTypeName: string = req.params.listTypeName;

    ListType.find({ name: listTypeName }).then(items => {
      if (Array.isArray(items) && items.length > 0) {
        let listTypeId: string = "";
        items.map(item => {
          listTypeId = item.id;
        });

        List.find({ listTypeId: listTypeId })
          .then(listTypes => {
            res.json(listTypes);
          })
          .catch(e => {
            res.status(400).json(e);
          });
      } else {
      }
    });
  }
);

/**
 * @method Get List options by ListTypeId
 */

router.get("/list/:listTypeId", (req: Request, res: Response) => {
  let listTypeId: string = req.params.listTypeId;

  List.find({ listTypeId: listTypeId })
    .populate("listTypeId")
    .then(listTypes => {
      res.json(listTypes);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

/**
 * @method Post List Type
 */
router.post("/type", (req: Request, res: Response) => {
  let name: string = req.body.name;

  ListType.find({ name }).then(items => {
    if (Array.isArray(items) && items.length > 0) {
      // Listtype with the same name exists

      res.status(400).json({ error: "Such a ListType already exists" });
    } else {
      let listType = new ListType({
        name
      });
      listType
        .save()
        .then(listType => {
          res.json(listType);
        })
        .catch((e: Error) => {
          res.status(400).json(e);
        });
    }
  });
});

/**
 * @method Post list option
 */
router.post("/list", (req: Request, res: Response) => {
  let { value, descr, listTypeId } = req.body;

  ListType.find({ _id: listTypeId }).then(LTItem => {
    if (Array.isArray(LTItem) && LTItem.length > 0) {
      // If given listTypeId exists - proceed with logic

      List.find({ listTypeId, value }).then(LItem => {
        if (Array.isArray(LItem) && LItem.length < 1) {
          // If given listTypeId and value DO NOT exist - proceed with logic. This means we will not make a duplicate value

          let newList = new List({
            value,
            descr,
            listTypeId
          })
            .save()
            .then(item => {
              res.json(item);
            })
            .catch(e => res.status(400).json(e));
        } else {
          res.status(400).json({
            error:
              "There already is a List option with the same value and listTypeId "
          });
        }
      });
    } else {
      res.status(400).json({ error: "Given listTypeId does not exist" });
    }
  });
});

export default router;
