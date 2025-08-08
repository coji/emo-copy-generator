import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/index/route.tsx'),
  route('/api', 'routes/api.ts'),
  route('/lp/generate/:id', 'routes/lp.generate.$id/route.tsx'),
  route('/lp/dashboard', 'routes/lp.dashboard/route.tsx'),
  route('/lp/share/:id', 'routes/lp.share.$id/route.tsx'),
  route('/lp/:id', 'routes/lp.$id/route.tsx'),
] satisfies RouteConfig
