import yaml from 'js-yaml';
import axios from 'axios';
import queryString from 'query-string';

export type DocType = {
  version: string;
  diagrams: DiagramType[];
};
export type DiagramType = {
  at: string;
  goal: Record<string, GoalType>;
  csf: Record<string, CsfType>;
  actions: Record<string, ActionType>;
  status: Record<string, StatusType>;
};
export type NodeCommonType = {
  obsolete?: boolean;
  new?: boolean;
};
export type GoalType = null | NodeCommonType;
export type CsfType = null | NodeCommonType;
export type ActionType = {
  for: string | string[];
  result: string;
} & NodeCommonType;
export type StatusType = string;

export const fetchData = async (): Promise<DocType> => {
  const uri = queryString.parseUrl(window.location.href);
  const dataUri = uri.query.data;
  if (!dataUri) {
    throw new Error('data query parameter is not specified.');
  }

  const response = await axios.get(
    dataUri instanceof Array ? dataUri[0] : dataUri
  );
  const doc = response.data;
  if (!doc) {
    throw new Error('data is empty.');
  }

  // TODO: まじめにtype guard作る
  return yaml.safeLoad(doc) as DocType;
};
