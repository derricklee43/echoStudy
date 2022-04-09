interface SidebarRouteItemProps {
  name: string;
  route: string;
}

export const SIDEBAR_ROUTE_ITEMS: SidebarRouteItemProps[] = [
  {
    name: 'flashcard decks',
    route: '/', // todo: actually probably have a homepage
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
