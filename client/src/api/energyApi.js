import axios from 'axios';

export const getEnergyPredictions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/predict');
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};