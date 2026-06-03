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
    url: appUtils.makeAjaxUrl(`/users/me?populate=*`),
    type: "GET",
  }, { showError: false, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Mot de passe oublié — Étape 1 : demande d'un code OTP par email
 */
export const forgotPassword = async (email, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    url: appUtils.makeAjaxUrl(`/auth/forgot-password-otp`),
    type: "POST",
    data: { email },
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if (response?.error || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Mot de passe oublié — Étape 2 : vérification du code OTP
 */
export const verifyResetOtp = async (email, code, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    url: appUtils.makeAjaxUrl(`/auth/verify-reset-otp`),
    type: "POST",
    data: { email, code },
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if (response?.error || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

/**
 * Mot de passe oublié — Étape 3 : réinitialisation du mot de passe
 */
export const resetPassword = async (data, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    url: appUtils.makeAjaxUrl(`/auth/reset-password-otp`),
    type: "POST",
    data,
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if (response?.error || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};

export const updateProfile = async (data, cb = null) => {
  const appUtils = useAppUtils();

  const response = await appUtils.ajax({
    // contentType: false,
    // processData: false,
    url: appUtils.makeAjaxUrl(`/auth/profile`),
    type: "PUT",
    data: data,
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if(response?.error  || response?.internal_error) {
    console.log('[Code 200 Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};


