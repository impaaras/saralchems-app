// navigationService.js
import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export let currentRouteName = null;
export let previousRouteName = null;

export function onNavigationReady() {
  currentRouteName = navigationRef.getCurrentRoute().name;
}

export function onStateChange() {
  const currentRoute = navigationRef.getCurrentRoute();
  if (currentRoute) {
    previousRouteName = currentRouteName;
    currentRouteName = currentRoute.name;
  }
}
