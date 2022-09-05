import { paths } from './paths';

interface SidebarRouteItemProps {
  name: string;
  route: string;
}

// todo: actually probably have a homepage and maybe make `echoStudy` go back to home

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
    name: 'study',
    route: paths.study,
  },
  {
    name: 'search',
    route: paths.search,
  },
];
