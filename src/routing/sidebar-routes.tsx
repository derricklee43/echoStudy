import { paths } from './paths';

interface SidebarRouteItemProps {
  name: string;
  route: string;
}

export const SIDEBAR_ROUTE_ITEMS: SidebarRouteItemProps[] = [
  {
    name: 'flashcard decks',
    route: paths.decks,
  },
  {
    name: 'create',
    route: paths.createDeck,
  },
  {
    name: 'search',
    route: paths.search,
  },
  {
    name: 'my profile',
    route: paths.profile,
  },
];
