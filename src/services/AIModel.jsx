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
  const model = 'gemini-2.5-pro';
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

async function main() {
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
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget. 

You MUST return the response in EXACTLY this JSON structure with these EXACT key names (do not change any key names):

{
  "hotels": [
    {
      "HotelName": "string",
      "HotelAddress": "string", 
      "Price": "string",
      "HotelImageUrl": "string",
      "GeoCoordinates": {
        "latitude": number,
        "longitude": number
      },
      "Rating": number,
      "Description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "Day 1: Title",
      "bestTimeToVisit": "string",
      "places": [
        {
          "placename": "string",
          "PlaceDetails": "string",
          "PlaceImageUrl": "string", 
          "GeoCoordinates": {
            "latitude": number,
            "longitude": number
          },
          "ticketPricing": "string",
          "rating": number,
          "timeTravel": "string"
        }
      ]
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. Use ONLY these exact key names: "hotels", "itinerary", "HotelName", "HotelAddress", "Price", "HotelImageUrl", "GeoCoordinates", "Rating", "Description", "day", "bestTimeToVisit", "places", "placename", "PlaceDetails", "PlaceImageUrl", "ticketPricing", "rating", "timeTravel", "latitude", "longitude".
2. DO NOT include any reference numbers, citations, or bracketed numbers like [1], [2, 3], [13, 16, 26, 28, 30] in any text fields.
3. Write all descriptions and details in clean, natural language without any citations or reference markers.
4. Return ONLY the JSON object without any markdown formatting, code blocks, or additional text.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `{
  "hotels": [
    {
      "HotelName": "Circus Circus Hotel, Casino & Theme Park",
      "HotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
      "Price": "Starting from around $30-50 per night",
      "HotelImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Circus_Circus_hotel_and_casino_in_Las_Vegas_at_night.jpg/1200px-Circus_Circus_hotel_and_casino_in_Las_Vegas_at_night.jpg",
      "GeoCoordinates": {
        "latitude": 36.1375,
        "longitude": -115.1646
      },
      "Rating": 3.5,
      "Description": "A circus-themed hotel and casino offering a unique and fun atmosphere with the Adventuredome theme park on-site."
    },
    {
      "HotelName": "Excalibur Hotel & Casino",
      "HotelAddress": "3850 S Las Vegas Blvd, Las Vegas, NV 89109",
      "Price": "Starting from around $40-60 per night",
      "HotelImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Excalibur_Hotel_Casino_in_June_2023.jpg/1200px-Excalibur_Hotel_Casino_in_June_2023.jpg",
      "GeoCoordinates": {
        "latitude": 36.0986,
        "longitude": -115.1758
      },
      "Rating": 3.5,
      "Description": "A medieval castle-themed hotel and casino connected to other resorts by a free tram."
    }
  ],
  "itinerary": [
    {
      "day": "Day 1: The Iconic South Strip",
      "bestTimeToVisit": "Late Afternoon to Evening",
      "places": [
        {
          "placename": "Welcome to Fabulous Las Vegas Sign",
          "PlaceDetails": "The iconic neon sign that has welcomed visitors since 1959. A must-do for a classic Las Vegas photo opportunity.",
          "PlaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Welcome_to_Fabulous_Las_Vegas_sign.jpg/1200px-Welcome_to_Fabulous_Las_Vegas_sign.jpg",
          "GeoCoordinates": {
            "latitude": 36.0821,
            "longitude": -115.1728
          },
          "ticketPricing": "Free",
          "rating": 4.5,
          "timeTravel": "Located at the south end of the Strip"
        },
        {
          "placename": "Bellagio Fountains Show", 
          "PlaceDetails": "An iconic and romantic free show of water, music, and light. The fountains dance to a variety of songs.",
          "PlaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Fountains_of_Bellagio_at_dusk.jpg/1200px-Fountains_of_Bellagio_at_dusk.jpg",
          "GeoCoordinates": {
            "latitude": 36.1127,
            "longitude": -115.1743
          },
          "ticketPricing": "Free",
          "rating": 4.9,
          "timeTravel": "15-20 minute walk from Las Vegas Sign"
        }
      ]
    },
    {
      "day": "Day 2: Downtown Charm & Fremont Street Fun",
      "bestTimeToVisit": "Evening",
      "places": [
        {
          "placename": "Fremont Street Experience",
          "PlaceDetails": "A vibrant pedestrian mall in the heart of downtown Las Vegas with Viva Vision light shows.",
          "PlaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fremont_Street_Experience_2023.jpg/1200px-Fremont_Street_Experience_2023.jpg",
          "GeoCoordinates": {
            "latitude": 36.1707,
            "longitude": -115.1439
          },
          "ticketPricing": "Free to enter",
          "rating": 4.6,
          "timeTravel": "Short bus ride from the Strip"
        }
      ]
    }
  ]
}`,
        },
      ],
    }
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    // console.log(chunk.text);
  }
}

main();