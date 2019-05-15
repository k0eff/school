import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import List from "../model/list";
import ListType from "../model/listType";
import ListRelation from "../model/listRelation";
import { Error } from "mongoose";

/**
 * @method Get List option data by id
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
 * @method TODO: Get List options by type
 */

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
 * @method TODO: Post list option
 */

export default router;
