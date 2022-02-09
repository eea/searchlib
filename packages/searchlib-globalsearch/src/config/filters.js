import { getTodayWithTime } from '../utils';

export default {
  // filter values that are always added to the ES requests
  permanentFilters: [
    { term: { hasWorkflowState: 'published' } },
    () => ({
      constant_score: {
        filter: {
               range: { 'issued.date': { lte: getTodayWithTime() } },
        },
      },
    }),
  ],
};
