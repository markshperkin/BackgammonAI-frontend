import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const SSE_BASE = import.meta.env.VITE_SSE_URL;
// const API_BASE = "http://127.0.0.1:5000/api/game";
// const SSE_BASE = "http://127.0.0.1:5000/"


// start game
export const startGame = async (aiType) => {
    try {
        const response = await axios.post(
            `${API_BASE}/start`,
            { aiType }
        );
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to start game" };
    }
};

// rolling the dice
export const rollDice = async () => {
    try {
        const response = await axios.get(`${API_BASE}/roll-dice`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to roll dice" };
    }
};

// make a move
export const makeMove = async (start, end) => {
    try {
        const response = await axios.post(`${API_BASE}/move`, { start, end });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Invalid move" };
    }
};

// get the game state
export const getGameState = async () => {
    try {
        const response = await axios.get(`${API_BASE}/state`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Failed to fetch game state" };
    }
};

// get all valid moves
export const getValidMoves = async (payload) => {
    try {
      const response = await axios.post(`${API_BASE}/valid-moves`, payload);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return { error: "Failed to fetch valid moves" };
    }
  };

// AI agent move
export const aiMove = async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai-move`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return { error: "AI move failed" };
    }
  };
  
// data stream of minimax search graph
export function connectSearchStream(SSE_BASE, onEvent) {
    const source = new EventSource(SSE_BASE);
  
    source.onopen = () => {
      console.log('[SSE Connected to server');
    };
  
    source.onmessage = (e) => {
    // console.log('[SSE] Raw data:', e.data);
      try {
        const event = JSON.parse(e.data);
        // console.log('[SSE] Parsed event:', event);
        onEvent(event);
      } catch (err) {
        console.error('[SSE] Parse error:', err, e.data);
      }
    };
  
    source.onerror = (err) => {
      console.error('[SSE] Connection error:', err);
    };
  
    return source;
  }

  
  
