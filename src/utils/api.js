const BASE_URL =
  "https://intelliclick-server-dev-1082184296521.us-central1.run.app/api";

const getToken = () => localStorage.getItem("authToken");

const fetchWithAuth = async (endpoint, options = {}) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzNmM2MyMTYwMjgzMmQ1ZDU5NmM4NmEiLCJyb2xlIjoiQkRBIiwibW9kZXJhdG9yIjpmYWxzZSwiZW1haWwiOiJ0ZXN0LnN0dWRlbnRAZ21haWwuY29tIiwibmFtZSI6IlRlc3QgQkRBIiwiaWF0IjoxNzMzMzExMzkwfQ.qKxXIiRnfIJicN6HB77Pa46r-zY4JVLREy5ueJsiXLs";
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

export const addOrUpdateSubject = async (subjectName, minAmount, maxAmount) => {
  const endpoint = `/subject/write/insert-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify({
      name: subjectName,
      minAmount,
      maxAmount,
    }),
  });
  return handleResponse(response, "Failed to create or update subject");
};

export const createOrUpdatePlan = async (planDetails) => {
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
