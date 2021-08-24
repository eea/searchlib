import { atom } from 'jotai';
import { atomFamily, atomWithReducer } from 'jotai/utils';

const requestReducer = (prev, action) => {
  console.log('reducer', { prev, action });
  switch (action.type) {
    case 'loading':
      return {
        ...prev,
        loading: true,
        loaded: false,
      };
    case 'loaded':
      return {
        ...prev,
        loading: false,
        loaded: true,
        data: action.data,
      };
    default:
      break;
  }
  return prev;
};

export const requestFamily = atomFamily(
  (param) =>
    atomWithReducer(
      {
        loading: false,
        loaded: false,
        data: null,
      },
      requestReducer,
    ),
  (a, b) => a === b,
);

export const debounceAtom = atom(0);
