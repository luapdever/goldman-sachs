import { useAppUtils } from "@/composables/useAppUtils";

/**
 * Get statistics
 */

export const getStatistics = async (data = {}, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/users/statistics`),
    type: "POST",
    data,
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Get current investments
 */

export const getInvestments = async (cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/investments?pagination[limit]=-1`),
    type: "GET",
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Place investment
 */

export const placeInvestment = async (data, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/investments`),
    type: "POST",
    data: {
      data,
    },
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Get machines
 */

export const getMachines = async (cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/machines?pagination[limit]=-1`),
    type: "GET",
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};


