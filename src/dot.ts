import { attribute, digraph, toDot } from 'ts-graphviz';
import { DiagramType, DocType, NodeCommonType } from './data';

export const makeDots = (doc: DocType): string[] => {
  return doc.diagrams.map(makeDot);
};

const makeDot = (diagram: DiagramType): string => {
  const goalId: string = Object.keys(diagram.goal)[0];

  const g = digraph();
  g.set(attribute.rankdir, 'LR');

  g.subgraph('clusterGoal', (subgraphGoal) => {
    subgraphGoal.set(attribute.label, '勝利条件');
    subgraphGoal.set(attribute.color, 'invis');

    for (const [goalId, goal] of Object.entries(diagram.goal)) {
      subgraphGoal.node(goalId, {
        ...makeNodeCommonAttribute(goal),
        ...{
          [attribute.fillcolor]: 'orange',
        },
      });
    }
  });

  g.subgraph('clusterCsf', (subgraphCsf) => {
    subgraphCsf.set(attribute.label, '中間目的');
    subgraphCsf.set(attribute.color, 'invis');

    for (const [csfId, csf] of Object.entries(diagram.csf)) {
      subgraphCsf.node(csfId, makeNodeCommonAttribute(csf));
    }
  });

  for (const csfId of Object.keys(diagram.csf)) {
    g.edge([csfId, goalId]);
  }

  g.subgraph('clusterAction', (subgraphAction) => {
    subgraphAction.set(attribute.label, '施策');
    subgraphAction.set(attribute.color, 'invis');

    for (const [actionId, action] of Object.entries(diagram.actions)) {
      subgraphAction.node(actionId, makeNodeCommonAttribute(action));

      if (action.result) {
        const actionResultId = `${actionId}-result`;
        subgraphAction.node(actionResultId, {
          [attribute.shape]: 'note',
          [attribute.label]: action.result,
        });
      }
    }
  });

  for (const [actionId, action] of Object.entries(diagram.actions)) {
    const forCsfs = action.for instanceof Array ? action.for : [action.for];
    for (const forCsf of forCsfs) {
      g.edge([actionId, forCsf]);
    }
  }

  return toDot(g);
};

const makeNodeCommonAttribute = (node: NodeCommonType | null) => {
  if (node === null) {
    return {
      [attribute.style]: 'filled',
      [attribute.fillcolor]: 'white',
    };
  }
  const fillcolor = node.obsolete ? 'grey' : node.new ? 'yellow' : 'white';
  return {
    [attribute.style]: 'filled',
    [attribute.fillcolor]: fillcolor,
  };
};
