import {
  INSTALLATION_JOB_LIST_REQUEST,
  INSTALLATION_JOB_LIST_SUCCESS,
  INSTALLATION_JOB_LIST_FAIL,
  INSTALLATION_JOB_DETAILS_REQUEST,
  INSTALLATION_JOB_DETAILS_SUCCESS,
  INSTALLATION_JOB_DETAILS_FAIL,
  INSTALLATION_JOB_DETAILS_RESET,
  FEATURED_INSTALLATION_JOBS_REQUEST,
  FEATURED_INSTALLATION_JOBS_SUCCESS,
  FEATURED_INSTALLATION_JOBS_FAIL,
} from '../constants/Installationconstants';

// ============================================================================
// Installation Job List Reducer
// State: { loading, jobs: [], count, next, previous, error }
// ============================================================================
export const installationJobListReducer = (state = { jobs: [] }, action) => {
  switch (action.type) {
    case INSTALLATION_JOB_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case INSTALLATION_JOB_LIST_SUCCESS:
      return {
        loading: false,
        jobs: action.payload.results ?? action.payload,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        error: null,
      };

    case INSTALLATION_JOB_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// ============================================================================
// Installation Job Details Reducer
// State: { loading, job: {}, error }
// ============================================================================
export const installationJobDetailsReducer = (state = { job: {} }, action) => {
  switch (action.type) {
    case INSTALLATION_JOB_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case INSTALLATION_JOB_DETAILS_SUCCESS:
      return { loading: false, job: action.payload, error: null };

    case INSTALLATION_JOB_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case INSTALLATION_JOB_DETAILS_RESET:
      return { job: {} };

    default:
      return state;
  }
};

// ============================================================================
// Featured Installation Jobs Reducer
// State: { loading, jobs: [], error }
// ============================================================================
export const featuredInstallationJobsReducer = (state = { jobs: [] }, action) => {
  switch (action.type) {
    case FEATURED_INSTALLATION_JOBS_REQUEST:
      return { ...state, loading: true, error: null };

    case FEATURED_INSTALLATION_JOBS_SUCCESS:
      return {
        loading: false,
        jobs: action.payload.results ?? action.payload,
        error: null,
      };

    case FEATURED_INSTALLATION_JOBS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};