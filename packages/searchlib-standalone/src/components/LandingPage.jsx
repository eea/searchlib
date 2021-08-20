import React from 'react';
import { runRequest } from '@eeacms/search';

import objectProvidesWhitelist from '../json/objectProvidesWhitelist.json';
import spatialWhitelist from '../json/spatialWhitelist.json';

import './styles.css'

const REQUEST = {
    "aggs": {
      "languages": {
        "terms": {
          "field": "language",
          "size": 1000000
        }
      },
      "topics": {
        "terms": {
          "field": "topic",
          "size": 1000000
        }
      },
      "organisations": {
        "terms": {
          "field": "organisation",
          "size": 1000000
        }
      },
      "content_types": {
        "terms": {
          "field": "objectProvides",
          "size": 1000000
        }
      },
      "countries": {
        "terms": {
          "field": "spatial",
          "size": 1000000
        }
      },
      "max_timecoverage": {
        "max": {
          "script": "def vals = doc['time_coverage']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}"
        }
      },
      "min_timecoverage": {
        "min": {
          "script": "def vals = doc['time_coverage']; if (vals.length == 0){return 2000} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2000);}return ret;}"
        }
      }
    },
    "size": 0,
    "track_total_hits": true
  };
const LandingPage = (props) => {
    const { appConfig } = props;
    const [landingData, setLandingData] = React.useState();

    React.useEffect(() => {
        let alreadyRequested = false;

        async function fetchData() {
        const resp = await runRequest(REQUEST, appConfig);
        if (!alreadyRequested) setLandingData(resp.body);
        }
        fetchData();
        return () => {
        alreadyRequested = true;
        };
    }, [appConfig]);
    if (landingData){
        const total = landingData.hits.total.value;
        const min_time_coverage = landingData.aggregations.min_timecoverage.value;
        const max_time_coverage = landingData.aggregations.max_timecoverage.value;
        const organisations = landingData.aggregations.organisations.buckets.length;
        const topics = landingData.aggregations.topics.buckets.length;
        const languages = landingData.aggregations.languages.buckets.length;
        const content_types = landingData.aggregations.content_types.buckets.filter(
            (bucket) => objectProvidesWhitelist.indexOf(bucket.key) !== -1,
        ).length;
        const countries = landingData.aggregations.countries.buckets.filter(
            (bucket) => spatialWhitelist.indexOf(bucket.key) !== -1,
        ).length;
        return (
            <div className="landing-page">
                <div className="tile available_content">
                    <h2>
                        Instantly search over 20 years of environmental knowledge by EEA
                    </h2>
                    <h3>
                        Documents
                    </h3>
                    <span>{total}</span>
                    <h3>
                        Languages
                    </h3>
                    <span>{languages}</span>
                </div>

                <div className="tile picture">
                </div>

                <div className="tile topics">
                    <h2>
                        Topics
                    </h2>
                    <span>{topics}</span>
                </div>

                <div className="tile time_coverage">
                    <h2>
                        Time coverage
                    </h2>
                    <p>
                        <span>
                            from
                        </span>
                        <span>
                            {min_time_coverage}
                        </span>
                    </p>
                    <p>
                        <span>
                            to
                        </span>
                        <span>
                            {max_time_coverage}
                        </span>
                    </p>
                </div>

                <div className="tile organisations">
                    <h2>
                        Organisations
                    </h2>
                    <span>{organisations}</span>
                </div>

                <div className="tile content_types">
                    <h2>
                        Content Types
                    </h2>
                    <span>{content_types}</span>
                </div>

                <div className="tile countries">
                    <h2>
                        Countries
                    </h2>
                    <span>{countries}</span>
                </div>
            </div>
        )
    }
    else {
        return '';
    }
}
export default LandingPage;
