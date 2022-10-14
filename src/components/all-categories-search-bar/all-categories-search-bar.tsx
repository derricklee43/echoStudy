import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import { useUserClient } from '../../hooks/api/use-user-client';
// import { createNewDeck } from '../../models/deck';
// import { paths } from '../../routing/paths';
// import { authJwtState } from '../../state/auth-jwt';
// import { userDecksState } from '../../state/user-decks';
// import { DropDownOption } from '../drop-down-options/drop-down-options';
// import { CategorySearchBar } from '../search-bar/category-search-bar/category-search-bar';
// import { SearchBar } from '../search-bar/search-bar';
// import './all-categories-search-bar.scss';

// // TODO: Break Search Bar into three components, baseSearchBar, SearchBar, and CategorySearchBar
// // TODO: Category options might overlap, prefix with categoryName on the id
// // TODO: Filter options outside of BaseSearchBar

// const ALL_SEARCH_CATEGORIES = ['all', 'my decks', 'public decks', 'users'] as const;

// type SearchCategory = typeof ALL_SEARCH_CATEGORIES[number];

// export const AllCategoriesSearchBar = () => {
//   const authJwt = useRecoilValue(authJwtState);
//   const myDecks = useRecoilValue(userDecksState);
//   const publicDecks = ['A', 'B', 'C'].map((letter) => {
//     const deck = createNewDeck();
//     deck.metaData.title = letter;
//     return deck;
//   });
//   const users = ['Derol', 'John', 'Sally'];

//   const userClient = useUserClient();
//   const navigate = useNavigate();

//   const [searchCategory, setSearchCategory] = useState<SearchCategory>('my decks');

//   const categoryOptions: DropDownOption<SearchCategory, SearchCategory>[] =
//     ALL_SEARCH_CATEGORIES.map((category) => ({
//       id: category,
//       value: category,
//       focusable: true,
//     }));

//   return (
//   );

//   function getDeckOptions(): DropDownOption<string, string>[] {
//     return myDecks.map((deck) => ({
//       id: deck.metaData.id.toString(),
//       value: deck.metaData.title,
//       focusable: true,
//     }));
//   }

//   function getDropdownOptions() {
//     const options: Record<SearchCategory, DropDownOption<string, string>[]> = {
//       all: [],
//       'my decks': [],
//       'public decks': [],
//       users: [],
//     };
//   }

//   function getAllCategoryOptions(): DropDownOption<string, string>[] {
//     const myDecksOptions = myDecks.map(({ metaData }) =>
//       getDropDownOption(metaData.id.toString(), metaData.title)
//     );

//     const publicDecksOptions = publicDecks.map(({ metaData }) =>
//       getDropDownOption(metaData.id.toString(), metaData.title)
//     );

//     const usersOptions = users.map((user) => getDropDownOption(user, user));
//     return [
//       getDropDownHeading('my decks'),
//       ...myDecksOptions,
//       getDropDownHeading('public decks'),
//       ...publicDecksOptions,
//       getDropDownHeading('users'),
//       ...usersOptions,
//     ];
//   }

//   function getDropDownHeading(heading: string) {
//     return {
//       id: heading,
//       value: heading,
//       focusable: false,
//     };
//   }

//   function getDropDownOption(id: string, value: string) {
//     return {
//       id: id,
//       value: id,
//       focusable: true,
//     };
//   }
// };
