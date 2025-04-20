import {ROUTES} from '../../constants/routes';

let currentRouteName = '';
export const getRouteName = () => {
  switch (currentRouteName) {
    case ROUTES.HISTORY:
      return 'Order History';
    case ROUTES.CART:
      return 'Cart Summary';
    case ROUTES.ITEM_SCREEN:
      return 'Item Screen';
    case ROUTES.TRACKING:
      return 'Order Tracking';
    case ROUTES.HOME:
      return 'Trending Products';
    case 'products':
      return 'Products';
    case ROUTES.PROFILE:
      return 'Profile';
    case ROUTES.PRODUCT_DETAILS:
      return name; // Fixed dynamic issue
    case ROUTES.SEARCH:
      return 'Search';
  }
};
