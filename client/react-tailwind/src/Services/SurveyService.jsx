// SurveyService.jsx

export const createSurvey = async (surveyData) => {
  const response = await fetch("http://localhost:4000/api/survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(surveyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.response = { data: errorData };
    throw error;
  }

  return await response.json();
};
