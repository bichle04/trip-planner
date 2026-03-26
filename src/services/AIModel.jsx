import {
  GoogleGenAI,
} from '@google/genai';

// Hàm để loại bỏ citations và reference numbers
const cleanTextFromCitations = (text) => {
  if (typeof text !== 'string') return text;
  // Loại bỏ các pattern như [1], [2, 3], [13, 16, 26, 28, 30], etc.
  return text.replace(/\s*\[[0-9,\s]+\]/g, '').trim();
};

// Hàm để clean up toàn bộ trip data
const cleanTripData = (tripData) => {
  if (typeof tripData === 'string') {
    tripData = JSON.parse(tripData);
  }

  // Clean hotels
  if (tripData.hotels) {
    tripData.hotels = tripData.hotels.map(hotel => ({
      ...hotel,
      Description: cleanTextFromCitations(hotel.Description),
      HotelName: cleanTextFromCitations(hotel.HotelName)
    }));
  }

  // Clean itinerary
  if (tripData.itinerary) {
    tripData.itinerary = tripData.itinerary.map(day => ({
      ...day,
      day: cleanTextFromCitations(day.day),
      bestTimeToVisit: cleanTextFromCitations(day.bestTimeToVisit),
      places: day.places ? day.places.map(place => ({
        ...place,
        placename: cleanTextFromCitations(place.placename),
        PlaceDetails: cleanTextFromCitations(place.PlaceDetails),
        timeTravel: cleanTextFromCitations(place.timeTravel),
        ticketPricing: cleanTextFromCitations(place.ticketPricing)
      })) : []
    }));
  }

  return tripData;
};

export const GetTripData = async (inputPrompt) => {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: inputPrompt,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }

    // Extract JSON from code blocks if present
    let jsonString = result;
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    }

    // Validate that it's valid JSON
    try {
      const parsedData = JSON.parse(jsonString);
      const cleanedData = cleanTripData(parsedData);
      return JSON.stringify(cleanedData);
    } catch (parseError) {
      console.error('Invalid JSON returned from AI:', parseError);
      throw new Error('AI returned invalid JSON format');
    }
  } catch (error) {
    console.error('Error calling AI API:', error);
    throw error;
  }
}

// main();