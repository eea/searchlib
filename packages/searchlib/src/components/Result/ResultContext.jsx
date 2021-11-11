import React from 'react';

// TODO: this is rather hackish and possibly insecure. Ideally all results
// already provide simple text instead of HTML
const normalizeStr = (str) => {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = str;
  str = tmp.textContent || tmp.innerText || '';
  return str;
};

function Highlight(props) {
  const { fragments = {} } = props;
  return Object.keys(fragments).map((name, i) => {
    return (
      <p className={`highlight-${name}`} key={`${i}-${name}`}>
        {fragments[name].map((f, j) => (
          <span className="fragment" key={`${i}-${j}-${name}`}>
            <span dangerouslySetInnerHTML={{ __html: f }} />
            {` ... `}
          </span>
        ))}
      </p>
    );
  });
}

const ResultContext = (props) => {
  const { result } = props;
  const description = normalizeStr(result.description || '');
  return result.highlight ? (
    <Highlight fragments={result.highlight} />
  ) : (
    <p>{description}</p>
  );
};

export default ResultContext;
