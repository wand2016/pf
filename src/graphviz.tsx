import PropTypes from 'prop-types';
import * as uuid from 'uuid';
import { graphviz, GraphvizOptions } from 'd3-graphviz';
import React, { useEffect } from 'react';
import { transition } from 'd3-transition';

type GraphvizProps = {
  id?: string;
  options?: GraphvizOptions;
  dot: string;
};
const Graphviz: React.FC<GraphvizProps> = ({ id, options, dot }) => {
  const graphId = `graphviz-${id ?? uuid.v4()}`;

  useEffect(() => {
    render();
  });

  const render = () => {
    graphviz(`#${graphId}`)
      .options(options ?? {})
      .transition((): any => {
        return transition('main')
          .ease((t) => t)
          .duration(300);
      })
      .renderDot(dot);
  };
  return <div id={graphId} />;
};
Graphviz.propTypes = {
  id: PropTypes.string,
  options: PropTypes.object,
  dot: PropTypes.string.isRequired,
};

export default Graphviz;
