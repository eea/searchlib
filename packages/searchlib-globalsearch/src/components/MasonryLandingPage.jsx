import React from 'react';
import Masonry from 'react-masonry-component';

import { runRequest } from '@eeacms/search';

import objectProvidesWhitelist from '../json/objectProvidesWhitelist.json';
import spatialWhitelist from '../json/spatialWhitelist.json';

import { getTodayWithTime } from '../utils';

import '../styles/masonry-landing-page.less';

const RES_REQUEST = {
  // es_query_metadata: {
  //   query_type: 'landing page documents',
  // },
  query: {
    function_score: {
      query: {
        bool: {
          must: [
            {
              match_all: {},
            },
          ],
          filter: [
            {
              term: {
                hasWorkflowState: 'published',
              },
            },
            {
              constant_score: {
                filter: {
                  bool: {
                    should: [
                      {
                        bool: {
                          must_not: {
                            exists: {
                              field: 'issued',
                            },
                          },
                        },
                      },
                      {
                        range: {
                          'issued.date': {
                            lte: getTodayWithTime(),
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              constant_score: {
                filter: {
                  bool: {
                    should: [
                      {
                        bool: {
                          must_not: {
                            exists: {
                              field: 'expires',
                            },
                          },
                        },
                      },
                      {
                        range: {
                          expires: {
                            gte: getTodayWithTime(),
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  sort: [
    {
      'issued.index': {
        order: 'desc',
      },
    },
  ],
  size: 3,
};

const AGGS_REQUEST = {
  // es_query_metadata: {
  //   query_type: 'landing page',
  // },
  query: {
    bool: {
      must: [
        {
          match_all: {},
        },
      ],
    },
  },

  aggs: {
    languages: {
      terms: {
        field: 'language',
        size: 1000000,
      },
    },
    topics: {
      terms: {
        field: 'topic',
        size: 1000000,
      },
    },
    organisations: {
      terms: {
        field: 'organisation',
        size: 1000000,
      },
    },
    content_types: {
      terms: {
        field: 'objectProvides',
        size: 1000000,
      },
    },
    countries: {
      terms: {
        field: 'spatial',
        size: 1000000,
      },
    },
    max_timecoverage: {
      max: {
        script:
          "def vals = doc['time_coverage']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",
      },
    },
    min_timecoverage: {
      min: {
        script:
          "def vals = doc['time_coverage']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}",
      },
    },
  },
  size: 0,
  track_total_hits: true,
};

const LandingPage = (props) => {
  const { appConfig } = props;
  const [landingDataAggs, setLandingDataAggs] = React.useState();
  const [landingDataRes, setLandingDataRes] = React.useState();
  const alreadyRequested = React.useRef(false);

  React.useEffect(() => {
    async function fetchDataAggs() {
      if (!alreadyRequested.current) {
        const resp = await runRequest(AGGS_REQUEST, appConfig);
        setLandingDataAggs(resp.body);
      }
    }

    // console.log('request config: ', RES_REQUEST);
    async function fetchDataRes() {
      if (!alreadyRequested.current) {
        const resp = await runRequest(RES_REQUEST, appConfig);
        setLandingDataRes(resp.body);
      }
    }

    Promise.all([fetchDataAggs(), fetchDataRes()]).then(() => {
      alreadyRequested.current = true;
    });

    return () => {
      alreadyRequested.current = true;
    };
  }, [appConfig]);

  // console.log(landingDataAggs, landingDataRes);
  if (landingDataAggs?.hits && landingDataRes?.hits) {
    const total = landingDataAggs.hits?.total?.value;
    const min_time_coverage =
      landingDataAggs.aggregations.min_timecoverage.value;
    const max_time_coverage =
      landingDataAggs.aggregations.max_timecoverage.value;
    const organisations =
      landingDataAggs.aggregations.organisations.buckets.length;
    const topics = landingDataAggs.aggregations.topics.buckets.length;
    const languages = landingDataAggs.aggregations.languages.buckets.length;
    const content_types = landingDataAggs.aggregations.content_types.buckets.filter(
      (bucket) => objectProvidesWhitelist.indexOf(bucket.key) !== -1,
    ).length;
    const countries = landingDataAggs.aggregations.countries.buckets.filter(
      (bucket) => spatialWhitelist.indexOf(bucket.key) !== -1,
    ).length;
    const elements = landingDataRes.hits.hits;

    return (
      <div className="landing-page">
        <Masonry options={{ horizontalOrder: true }}>
          <div className="tile available_content">
            <h2>
              Instantly search over 20 years of environmental knowledge by EEA
            </h2>
            <h3>Documents</h3>
            <span>{total}</span>
            <h3>Languages</h3>
            <span>{languages}</span>
          </div>

          <div className="tile picture"></div>

          <div className="tile topics">
            <h2>Topics</h2>
            <span>{topics}</span>
          </div>

          <div className="tile time_coverage">
            <h2>Time coverage</h2>
            <p>
              <span className="label">from</span>
              <span className="value">{min_time_coverage}</span>
            </p>
            <p>
              <span className="label">to</span>
              <span className="value">{max_time_coverage}</span>
            </p>
          </div>
          <div className="tile organisations">
            <h2>Organisations</h2>
            <span>{organisations}</span>
          </div>

          <div className="tile content_types">
            <h2>Content Types</h2>
            <span>{content_types}</span>
          </div>
          <div className="tile countries">
            <h2>Countries</h2>
            <span>{countries}</span>
          </div>
          <div className="tile latest">
            <h2>Recently added</h2>
            <ul>
              {elements.map((element, i) => {
                const { about, title, issued } = element._source;
                return (
                  <li key={i}>
                    <a href={about}>{title}</a>
                    <span>Published on </span>
                    <span>{issued}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Masonry>
      </div>
    );
  } else {
    return '';
  }
};
export default LandingPage;
