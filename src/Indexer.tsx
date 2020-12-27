import React, { useReducer } from 'react';
import './App.css';
import { exhaustCheck } from './utils';

export const useIndexer = (length: number) => {
  type Action = 'first' | 'next' | 'prev' | 'last';
  const reducerFunc = (index: number, action: Action) => {
    switch (action) {
      case 'first':
        return 0;
      case 'next':
        return Math.min(index + 1, length - 1);
      case 'prev':
        return Math.max(0, index - 1);
      case 'last':
        return length - 1;
      default:
        return exhaustCheck(action);
    }
  };

  const [index, dispatch] = useReducer(reducerFunc, length - 1);
  return {
    index,
    dispatch,
  };
};
