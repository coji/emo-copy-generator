import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/index/route.tsx'),
  route('/api', 'routes/api.ts'),
] satisfies RouteConfig
