import apiClient from '../api/apiClient';
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
// LIST INSTALLATION JOBS  (GET /installations/jobs/)
// Supports all filters exposed by InstallationJobFilter + search + ordering
// ============================================================================

/**
 * params shape (all optional):
 *   search        – free-text search across title, model, make, items, etc.
 *   make          – vehicle make slug  e.g. "toyota"
 *   model         – vehicle model (icontains)
 *   year          – exact year
 *   year_from     – year range start
 *   year_to       – year range end
 *   status        – "pending" | "in_progress" | "completed" | "cancelled"
 *   is_featured   – true | false
 *   technician    – technician name (icontains)
 *   date_from     – job_date >=  (YYYY-MM-DD)
 *   date_to       – job_date <=  (YYYY-MM-DD)
 *   has_item_category – installed item category slug
 *   ordering      – "job_date" | "-job_date" | "created_at" | "-created_at" | "vehicle_model"
 *   page          – page number
 */
export const listInstallationJobs = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: INSTALLATION_JOB_LIST_REQUEST });

    const queryParams = new URLSearchParams();

    if (params.search)             queryParams.append('search', params.search);
    if (params.make)               queryParams.append('make', params.make);
    if (params.model)              queryParams.append('model', params.model);
    if (params.year)               queryParams.append('year', params.year);
    if (params.year_from)          queryParams.append('year_from', params.year_from);
    if (params.year_to)            queryParams.append('year_to', params.year_to);
    if (params.status)             queryParams.append('status', params.status);
    if (params.is_featured !== undefined) queryParams.append('is_featured', params.is_featured);
    if (params.technician)         queryParams.append('technician', params.technician);
    if (params.date_from)          queryParams.append('date_from', params.date_from);
    if (params.date_to)            queryParams.append('date_to', params.date_to);
    if (params.has_item_category)  queryParams.append('has_item_category', params.has_item_category);
    if (params.ordering)           queryParams.append('ordering', params.ordering);
    if (params.page)               queryParams.append('page', params.page);

    const { data } = await apiClient.get(`/installations/jobs/?${queryParams.toString()}`);

    dispatch({
      type: INSTALLATION_JOB_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INSTALLATION_JOB_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch installation jobs',
    });
  }
};

// ============================================================================
// GET INSTALLATION JOB DETAILS  (GET /installations/jobs/:id/)
// Returns full InstallationJobDetailSerializer payload incl. images & items
// ============================================================================
export const getInstallationJobDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: INSTALLATION_JOB_DETAILS_REQUEST });

    const { data } = await apiClient.get(`/installations/jobs/${id}/`);

    dispatch({
      type: INSTALLATION_JOB_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INSTALLATION_JOB_DETAILS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch installation job details',
    });
  }
};

// Reset job details state (call on component unmount to avoid stale data)
export const resetInstallationJobDetails = () => (dispatch) => {
  dispatch({ type: INSTALLATION_JOB_DETAILS_RESET });
};

// ============================================================================
// GET FEATURED INSTALLATION JOBS  (GET /installations/jobs/featured/)
// Lightweight list — used on homepage / portfolio showcase
// ============================================================================
export const getFeaturedInstallationJobs = () => async (dispatch) => {
  try {
    dispatch({ type: FEATURED_INSTALLATION_JOBS_REQUEST });

    const { data } = await apiClient.get('/installations/jobs/featured/');

    dispatch({
      type: FEATURED_INSTALLATION_JOBS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FEATURED_INSTALLATION_JOBS_FAIL,
      payload:
        error.response?.data?.message || error.message || 'Failed to fetch featured installation jobs',
    });
  }
};