import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/game";

export const startGame = async (aiType) => {
    try {
        const response = await axios.post(
            `${API_URL}/start`,
            { aiType }
        );
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to start game" };
    }
};

export const rollDice = async () => {
    try {
        const response = await axios.get(`${API_URL}/roll-dice`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to roll dice" };
    }
};

export const makeMove = async (start, end) => {
    try {
        const response = await axios.post(`${API_URL}/move`, { start, end });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Invalid move" };
    }
};

export const getGameState = async () => {
    try {
        const response = await axios.get(`${API_URL}/state`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to fetch game state" };
    }
};

export const getValidMoves = async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/valid-moves`, payload);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Failed to fetch valid moves" };
    }
  };

export const aiMove = async () => {
    try {
      const response = await axios.post(`${API_URL}/ai-move`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return { error: "AI move failed" };
    }
  };
  
  
  
