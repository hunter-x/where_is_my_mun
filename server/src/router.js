import { getPolling, postPolling } from './controllers/pollingController';
import { getShape, postShape } from './controllers/shapeController';
import { postUser } from './controllers/userController';

const router = (app,apiRoutes) => {
  app.post('/setup',postUser );

  app.use('/api', apiRoutes);

  apiRoutes.get('/polling/:gouv', getPolling);
  apiRoutes.post('/addpolling', postPolling);
 
  apiRoutes.get('/shape/:gouv', getShape);
  apiRoutes.post('/addshape', postShape);
};

export default router;
