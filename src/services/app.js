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


/**
 * Upload d'un fichier (capture de dépôt) vers Strapi /upload
 * Retourne le tableau de fichiers uploadés (avec leur id).
 */
export const uploadFile = async (file, cb = null) => {
  const appUtils = useAppUtils();

  const formData = new FormData();
  const filename = file?.name ?? `proof_${Date.now()}.jpg`;
  formData.append("files", file, filename);

  const response = await appUtils.ajax({
    url: appUtils.makeAjaxUrl(`/upload`),
    type: "POST",
    data: formData,
    dataType: false,     // ne pas sérialiser en JSON
    processData: false,  // jQuery : ne pas transformer le FormData
    contentType: false,  // laisser le navigateur définir le boundary multipart
  }, { showError: true, loadingKey: "sub" }, cb ?? undefined);

  if (response?.error || response?.internal_error) {
    console.log('[Upload Error] : ', response?.error, response?.internal_error);
    return null;
  }

  return response;
};


