import { router } from 'expo-router';
import type { NavigationKey } from '@/design-system';

const routes = {
  home: '/home',
  library: '/library',
  create: '/create-deck',
  review: '/review',
  profile: '/progress',
} as const;
export function navigateMain(key: NavigationKey) {
  if (key === 'create') router.push(routes[key]);
  else router.replace(routes[key]);
}
