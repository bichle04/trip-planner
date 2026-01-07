import { FcMoneyTransfer } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";
import { FcDonate } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcOldTimeCamera } from "react-icons/fc";

export const SelectTravelerList = [
    {
        id: 1,
        title: 'Just me',
        description: 'A sole traveller in exploration',
        icon: <FcPortraitMode />,
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        description: 'Two travellers in love',
        icon: <FcLike />,
        people: '2 people'
    },
    {
        id: 3,
        title: 'Family',
        description: 'A group of fun loving adv',
        icon: <FcHome />,
        people: '3-5 people'
    },
    {
        id: 4,
        title: 'Friends',
        description: 'A bunch of thrill-seekes',
        icon: <FcOldTimeCamera />,
        people: '5-10 people'
    }
]

export const SelectBudgeOptions = [
    {
        id: 1,
        title: 'Cheap',
        description: 'Stay conscious of costs',
        icon: <FcDonate />
    },
    {
        id: 2,
        title: 'Moderate',
        description: 'Keep cost on the average side',
        icon: <FcMoneyTransfer />
    },
    {
        id: 3,
        title: 'Luxury',
        description: 'Do not worry about cost',
        icon: <FcSalesPerformance />
    }
]

export const PopularDestinations = [
    'Hà Nội, Việt Nam',
    'Thành phố Hồ Chí Minh, Việt Nam',
    'Đà Nẵng, Việt Nam',
    'Hội An, Quảng Nam, Việt Nam',
    'Nha Trang, Khánh Hòa, Việt Nam',
    'Phú Quốc, Kiên Giang, Việt Nam',
    'Sapa, Lào Cai, Việt Nam',
    'Hạ Long, Quảng Ninh, Việt Nam',
    'Huế, Thừa Thiên Huế, Việt Nam',
    'Đà Lạt, Lâm Đồng, Việt Nam',
    'Bangkok, Thái Lan',
    'Singapore',
    'Kuala Lumpur, Malaysia',
    'Tokyo, Nhật Bản',
    'Seoul, Hàn Quốc',
    'Paris, Pháp',
    'London, Anh',
    'New York, Mỹ',
    'Sydney, Úc',
    'Rome, Ý'
]

export const AI_PROMT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. 

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
4. Return ONLY the JSON object without any markdown formatting, code blocks, or additional text.`