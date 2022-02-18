import { atom } from 'jotai';
import { atomFamily, useReducerAtom } from 'jotai/utils';

export function normalize_state(state) {
  let tmp_state = [];
  let has_names = true;
  if (typeof state?.[0] === 'string') {
    tmp_state = state;
  }
  if (typeof state?.[0] === 'object') {
    if (state?.[0]?.name) {
      tmp_state = state.map((st) => st.name);
    } else {
      tmp_state = state;
      has_names = false;
    }
  }
  return { tmp_state, has_names };
}

export const filterFamily = atomFamily(
  ({ filterName, initialState }) => {
    // console.log('f', { filterName, initialState });
    return atom(initialState);
  },
  (a, b) => a.filterName !== b.filterName,
);

export function filterStateReducer(prev, action) {
  console.log('reduce', prev, action);
  const { value } = action;
  const { tmp_state, has_names } = normalize_state(prev);
  const tmp_value = typeof value === 'object' ? value.name : value;

  switch (action.type) {
    case 'set':
      if (has_names && tmp_state.includes(tmp_value)) {
        return [];
      }
      return action.force ? value : [...prev, value];
    case 'remove':
      return [...prev].filter((v) =>
        typeof v === 'object' ? v.name !== tmp_value : v !== tmp_value,
      );
    case 'reset':
      return [...action.value];
    default:
      return [];
    // throw new Error();
  }
}

export function useFilterState(filterName, initialState) {
  const filterAtom = filterFamily({ filterName, initialState });
  console.log('filterAtom', filterAtom, filterName);
  const [state, dispatch] = useReducerAtom(filterAtom, filterStateReducer);

  // return [state, dispatch];
  return [];
}
