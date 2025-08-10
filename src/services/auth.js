import { useAppUtils } from "@/composables/useAppUtils";

/**
 * Sign In
 */
export const signIn = async (data, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/auth/local`),
    type: "POST",
    data: data,
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Sign Up
 */
export const signUp = async (data, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/auth/local/register`),
    type: "POST",
    data: data,
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

export const getProfile = async (cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/users/me`),
    type: "GET",
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};


