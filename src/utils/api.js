const BASE_URL =
  "https://intelliclick-server-dev-1082184296521.us-central1.run.app/api";

const getToken = () => localStorage.getItem("authToken");

const fetchWithAuth = async (endpoint, options = {}) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzI0ODZjMDA2NmU3ZWUzMzFiZDJhN2UiLCJyb2xlIjoiQkRBIiwibW9kZXJhdG9yIjpmYWxzZSwiZW1haWwiOiJiaXJhZy5ncHRhQGdtYWlsLmNvbSIsIm5hbWUiOiJCaXJhaiIsImlhdCI6MTczMTQzMzkyNH0.wz-zdIPBj5e3YxXZSSzgk6tZmZVb_gNEpHHTsQI_Oh0";
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: token,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
};

const handleResponse = (response, errorMessage) => {
  if (!response.ok) {
    const error = response.data?.message || "Unknown error";
    throw new Error(`${errorMessage}: ${error}`);
  }
  return response.data;
};

export const getAllPlans = async (planType) => {
  const endpoint = `/plan/read/get-all-plans?planType=${planType}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch plans");
};

export const getStateData = async (countryCode) => {
  const endpoint = `/user/read/get-state-data?country=${countryCode}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch state data");
};

export const getClassData = async () => {
  const endpoint = `/standard/read/get-all`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch class data");
};

export const getSubjectData = async () => {
  const endpoint = `/subject/read/get-all-subjects`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch subject data");
};

export const createOrUpdateStandard = async (standardDetails) => {
  const endpoint = `/standard/write/insert-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(standardDetails),
  });
  return response;
};

export const addOrUpdateSubject = async (subject) => {
  const endpoint = `/subject/write/insert-or-update`;

  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(subject),
  });
  return handleResponse(response, "Failed to create or update subject");
};

export const createOrUpdatePlan = async (planDetails) => {
  console.log("plandetails", planDetails);
  const endpoint = `/plan/write/create-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(planDetails),
  });
  return response;
};

export const deleteStandard = async (standardId) => {
  const endpoint = `/standard/delete/delete-standard`;
  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
    body: JSON.stringify({ id: standardId }),
  });

  return response;
};

export const deleteSubject = async (subjectId) => {
  const endpoint = `/subject/delete/delete-subject`;
  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
    body: JSON.stringify({ id: subjectId }),
  });

  return response;
};

export const getCourseData = async () => {
  const endpoint = `/course/read/get-all-courses-dropdown`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch subject data");
};

export const createCourse = async (mapPaymentIdEnrollment) => {
  const endpoint = `/course/write/create-or-update`;
  console.log("course ", mapPaymentIdEnrollment);
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(mapPaymentIdEnrollment),
  });
  return handleResponse(response, "Failed to create or update plan");
};

export const createOrUpdateBoard = async (boardDetails) => {
  const endpoint = `/board/write/create-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(boardDetails),
  });
  return response;
};

export const deleteCourse = async (courseId) => {
  const endpoint = `/course/delete/delete-one`;
  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
    body: JSON.stringify({ _id: courseId }),
  });

  return response;
};

export const deleteBoard = async (boardId) => {
  const endpoint = `/board/delete/delete-one`;

  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
    body: JSON.stringify({ _id: boardId }),
  });
  return response;
};

export const getBoardData = async () => {
  const endpoint = `/board/read/get-all-boards-dropdown`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch class data");
};

export const getAllSubscription = async (pageNum, pageSize) => {
  const endpoint = `/subscription/read/get-all-subscriptions?pageNum=${pageNum}&pageSize=${pageSize}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const getSubsubscriptionById = async (subcriptionId) => {
  const endpoint = `/subscription/read/get-subscription-by-id?id=${subcriptionId}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const getPlansByCourseId = async (courseId) => {
  // const endpoint = `/plan/read/get-all-plans?courseType=${courseId}`;
  // debugger;
  const endpoint = courseId
    ? `/plan/read/get-all-plans?courseType=${courseId}`
    : `/plan/read/get-all-plans`;

  console.log("endpoint", endpoint);
  const response = await fetchWithAuth(endpoint);
  console.log("response", response);
  return handleResponse(response, "Failed to fetch plan data");
};

export const getPlansById = async (planId) => {
  const endpoint = `/plan/read/get?planId=${planId}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch plan data");
};

export const getSubjectById = async (courseId) => {
  const endpoint = `/course/read/get?courseId=${courseId}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const getYearData = async () => {
  const endpoint = `/constant/read/get?constantType=yearCrud`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const createYeardata = async (createYear) => {
  const endpoint = `/constant/write/create-or-update`;
  console.log("create year ", createYear);
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(createYear),
  });
  return handleResponse(response, "Failed to create or update plan");
};
