interface SidebarRouteItemProps {
  name: string;
  route: string;
}

// todo: actually probably have a homepage and maybe make `echoStudy` go back to home

export const SIDEBAR_ROUTE_ITEMS: SidebarRouteItemProps[] = [
  {
    name: 'flashcard decks',
    route: '/decks',
  },
  {
    name: 'create',
    route: '/deck-editor/0', // todo: maybe different route without any params (:deckId)
  },
  {
    name: 'study',
    route: '/study',
  },
  {
    name: 'search',
    route: '/search',
  },
];
