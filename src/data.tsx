import yaml from 'js-yaml';
import axios from 'axios';
import queryString from 'query-string';
import Ajv from 'ajv';
import schema from './schema.json';

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

  if (!response.data) {
    throw new Error('data is empty.');
  }

  const doc = yaml.safeLoad(response.data);

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (!validate(doc)) {
    for (const err of validate.errors ?? []) {
      console.error(err);
    }
    const errorMessage = (validate.errors ?? [])
      .map((err) => {
        return JSON.stringify(err, null, 2);
      })
      .join();
    throw new Error(errorMessage);
  }

  return doc as DocType;
};
