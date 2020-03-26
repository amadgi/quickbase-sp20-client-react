import {MOCK_FIELD_API_URL} from "../common/constants";

export const postFieldService = async (fieldService) => {
  console.log(fieldService)
  const response = await fetch(MOCK_FIELD_API_URL, {
    method: 'POST',
    body: JSON.stringify(fieldService),
    headers: {
      "content-type": "application/json"
    }
  });
  return await response.json()
};