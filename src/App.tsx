import React, { useEffect, useState } from 'react';
import './App.css';
import { useIndexer } from './Indexer';
import { fetchData, DocType, DiagramType } from './data';
import { makeDots } from './dot';
import Graphviz from './graphviz';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';

type PropsType = {
  className?: string;
};
const App: React.FC<PropsType> = ({ className }) => {
  const [data, setData] = useState<DocType | null>(null);
  const { index, dispatch } = useIndexer((data?.diagrams ?? []).length);
  const diagram = (): DiagramType | undefined => {
    return (data?.diagrams ?? [])[index];
  };
  const [failed, fail] = useState(false);

  const dots = () => {
    if (data === null) {
      return [];
    }
    return makeDots(data);
  };
  const dot = (): string | undefined => {
    return dots()[index];
  };

  useEffect(() => {
    const f = async () => {
      try {
        setData(await fetchData());
      } catch (e) {
        console.error('data fetch error');
        fail(true);
        throw e;
      }
      dispatch('last');
    };
    f();
  }, []);

  if (failed) {
    return <div>データの読み込みに失敗しました。</div>;
  }

  if (!data || !diagram()) {
    return <></>;
  }

  return (
    <div className={className}>
      <div className="wrapper">
        <nav>
          <div style={{ verticalAlign: 'top' }}>
            <Button
              className="p-button-sm p-button-icon p-button-text"
              onClick={() => dispatch('first')}>
              <span className="p-paginator-icon pi pi-angle-double-left" />
              first
            </Button>
            <Button
              className="p-button-sm p-button-icon p-button-text"
              onClick={() => dispatch('prev')}>
              <span className="p-paginator-icon pi pi-angle-left" />
              prev
            </Button>
            <Button
              className="p-button-sm p-button-icon p-button-text"
              onClick={() => dispatch('next')}>
              next
              <span className="p-paginator-icon pi pi-angle-right" />
            </Button>
            <Button
              className="p-button-sm p-button-icon p-button-text"
              onClick={() => dispatch('last')}>
              last
              <span className="p-paginator-icon pi pi-angle-double-right" />
            </Button>
          </div>
        </nav>
        <Panel
          header={`(${index + 1} / ${data.diagrams.length}) ${
            diagram()?.at ?? null
          }`}>
          <div className="p-d-flex">
            <div className="p-d-inline-flex p-mr-4" style={{ width: '300px' }}>
              <Card className="status" style={{ width: '100%' }}>
                <section>
                  <header style={{ textAlign: 'center' }}>廟算八要素</header>
                  <dl>
                    {Object.entries(diagram()?.status ?? {}).map(
                      ([key, content]) => {
                        return (
                          <React.Fragment key={key}>
                            <dt>{key}</dt>
                            <dd>{content}</dd>
                          </React.Fragment>
                        );
                      }
                    )}
                  </dl>
                </section>
              </Card>
            </div>
            <div className="p-d-inline-flex">
              {dot() ? (
                <Card>
                  <Graphviz
                    id="graphviz0"
                    dot={dot() ?? ''}
                    options={{
                      width: 900,
                      height: 450,
                      fit: true,
                      zoom: false,
                    }}
                  />
                </Card>
              ) : null}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
App.propTypes = {
  className: PropTypes.string,
};

export default styled(App)`
  .wrapper {
    width: 1280px;
    margin: 0 auto;
  }
  .project-record {
    .status {
      width: 300px;
    }

    .diagram {
      width: 900px;
    }
  }
`;
