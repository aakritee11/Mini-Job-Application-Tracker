import express from "express"
const router = express.Router();
import {
  getAll,
  getById,
  create,
  update,
  deleteApplication
} from ('../controllers/applicationController');


router.get('/', getAll);


router.get('/:id', getById);


router.post('/', create);


router.patch('/:id', update);

router.delete('/:id', deleteApplication);

export  {router};