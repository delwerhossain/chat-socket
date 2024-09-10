import { Router } from 'express';

const router = Router();

const moduleRoutes = [{}];
router.use('/', (req, res) => {
  res.send('Hello World!');
});
// moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
