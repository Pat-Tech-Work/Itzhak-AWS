// SurveyService.jsx

export const createSurvey = async (surveyData) => {
  const response = await fetch("https://itzhak-aws-vkmdh.ondigitalocean.app/api/itzhak-aws-server/survey", {
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
