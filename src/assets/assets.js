// assets.js

import Golden from "./Golden.png";
import Labrador from "./Labrador.png";
import Beagle from "./Beagle.png";
import German from "./German.png";
import Poodle from "./Poodle.png";
import Logo from "./Logo.png";
import profilePicture from "./profilePicture.jpeg";
import dropdown from "./dropdown.png";
import groupprofile from "./groupprofile.png"
import arrowicon from "./arrowicon.png";
import HeaderImage from "./HeaderImage.png";
import appointment_img from "./appointment_img.png"
import dog1 from "./dog1.jpeg";
import dog2 from "./dog2.jpeg";
import dog3 from "./dog3.jpeg";
import dog4 from "./dog4.jpeg";
import dog5 from "./dog5.jpeg";
import dog6 from "./dog6.jpeg";
import dog7 from "./dog7.jpeg";
import dog8 from "./dog8.jpeg";
import dog9 from "./dog9.jpeg";
import dog10 from "./dog10.jpeg";
import golden2 from "./golden2.jpeg";
import golden3 from "./golden3.jpeg";
import lab2 from "./lab2.jpeg";
import lab3 from "./lab3.jpeg";
import beagle2 from "./beagle2.jpeg";
import beagle3 from "./beagle3.jpeg";
import german2 from "./german2.jpeg";
import german3 from "./german3.jpeg";
import poodle2 from "./poodle2.jpeg";
import poodle3 from "./poodle3.jpeg";
import about from "./about.jpg"
import contact from "./contact.jpg"
import banner2 from "./banner2.jpg"
import action from "./action.jpg"
import menu from "./menu_icon.png"
import cross from "./cross.png"



// Option 2: export as an object (good if you want to call them by name)
export const assets = {
  Golden,
  Labrador,
  Beagle,
  German,
  Poodle,
  Logo,
  profilePicture,
  dropdown,
  groupprofile,
  arrowicon,
  HeaderImage,
  dog1,
  dog2,
  dog3,
  dog4,
  dog5,
  dog6,
  dog7,
  dog8,
  dog9,
  dog10,
  appointment_img,
  golden2,
  golden3,
  lab2,
  lab3,
  beagle2,
  beagle3,
  german2,
  german3,
  poodle2,
  poodle3,
  about,
  contact,
  banner2,
  action,
  menu,
  cross,
  
};
export const BreedData =[
  {
    Breed: 'Golden Retriever',
    image: Golden
  },
  {
    Breed: 'Labrador',
    image: Labrador
  },
  {
    Breed: 'Beagle',
    image: Beagle
  },
  {
    Breed: 'German Shepherd',
    image: German
  },
  {
    Breed: 'Poodle',
    image: Poodle
  },
]
export const pets = [
  // 🟡 Golden Retrievers
  {
    id: 1,
    name: "Buddy",
    Breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    size: "Large",
    vaccinated: true,
    description: "Friendly and energetic, loves playing fetch.",
    location: "Kathmandu, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Gokarna Area, Ring Road",
      line2: "Kathmandu, Nepal",
    },
    image: dog1,
    fee: 1200,
  },
  {
    id: 2,
    name: "Daisy",
    Breed: "Golden Retriever",
    age: 4,
    gender: "Female",
    size: "Large",
    vaccinated: true,
    description: "Calm, gentle, and great with kids.",
    location: "Pokhara, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Lakeside Area, Fewa Rd",
      line2: "Pokhara, Nepal",
    },
    image: golden2,
    fee: 1000,
  },
  {
    id: 3,
    name: "Cooper",
    Breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    size: "Large",
    vaccinated: true,
    description: "Playful and loves swimming.",
    location: "Lalitpur, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Patan Durbar Square Vicinity",
      line2: "Lalitpur, Nepal",
    },
    image: golden3,
    fee: 1400,
  },

  // 🟢 Labradors
  {
    id: 4,
    name: "Luna",
    Breed: "Labrador",
    age: 2,
    gender: "Female",
    size: "Medium",
    vaccinated: true,
    description: "Gentle and affectionate, great with kids.",
    location: "Kathmandu, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Boudha Area, Ring Rd",
      line2: "Kathmandu, Nepal",
    },
    image: dog2,
    fee: 900,
  },
  {
    id: 5,
    name: "Max",
    Breed: "Labrador",
    age: 3,
    gender: "Male",
    size: "Medium",
    vaccinated: true,
    description: "Loves food and belly rubs.",
    location: "Pokhara, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Himalayan Road Area",
      line2: "Pokhara, Nepal",
    },
    image: lab2,
    fee: 950,
  },
  {
    id: 6,
    name: "Bella",
    Breed: "Labrador",
    age: 5,
    gender: "Female",
    size: "Medium",
    vaccinated: false,
    description: "Active and loves outdoor walks.",
    location: "Lalitpur, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Jawalakhel Area, Ekantakuna",
      line2: "Lalitpur, Nepal",
    },
    image: lab3,
    fee: 850,
  },

  // 🟠 Beagles
  {
    id: 7,
    name: "Charlie",
    Breed: "Beagle",
    age: 4,
    gender: "Male",
    size: "Small",
    vaccinated: false,
    description: "Curious and playful, loves long walks.",
    location: "Kathmandu, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Thamel Street, Tourist Area",
      line2: "Kathmandu, Nepal",
    },
    image: dog3,
    fee: 1100,
  },
  {
    id: 8,
    name: "Milo",
    Breed: "Beagle",
    age: 2,
    gender: "Male",
    size: "Small",
    vaccinated: true,
    description: "Cheerful and always sniffing around.",
    location: "Pokhara, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Mahendrapool Bazaar",
      line2: "Pokhara, Nepal",
    },
    image: beagle2,
    fee: 1150,
  },
  {
    id: 9,
    name: "Lucy",
    Breed: "Beagle",
    age: 3,
    gender: "Female",
    size: "Small",
    vaccinated: true,
    description: "Sweet and loves cuddles.",
    location: "Lalitpur, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Gwarko Chowk, Ring Rd",
      line2: "Lalitpur, Nepal",
    },
    image: beagle3,
    fee: 1000,
  },

  // 🔵 German Shepherds
  {
    id: 10,
    name: "Bella",
    Breed: "German Shepherd",
    age: 5,
    gender: "Female",
    size: "Large",
    vaccinated: true,
    description: "Loyal and protective, ideal for active families.",
    location: "Kathmandu, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Bansbari Area, Chakrapath",
      line2: "Kathmandu, Nepal",
    },
    image: dog4,
    fee: 1300,
  },
  {
    id: 11,
    name: "Rex",
    Breed: "German Shepherd",
    age: 3,
    gender: "Male",
    size: "Large",
    vaccinated: true,
    description: "Alert and disciplined, great guard dog.",
    location: "Pokhara, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Prithvi Chowk Junction",
      line2: "Pokhara, Nepal",
    },
    image: german2,
    fee: 1250,
  },
  {
    id: 12,
    name: "Zara",
    Breed: "German Shepherd",
    age: 2,
    gender: "Female",
    size: "Large",
    vaccinated: true,
    description: "Smart and loves learning new commands.",
    location: "Lalitpur, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Satdobato Ring Road",
      line2: "Lalitpur, Nepal",
    },
    image: german3,
    fee: 1350,
  },

  // 🟣 Poodles
  {
    id: 13,
    name: "Max",
    Breed: "Poodle",
    age: 1,
    gender: "Male",
    size: "Small",
    vaccinated: true,
    description: "Smart and playful, hypoallergenic coat.",
    location: "Kathmandu, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Dillibazar Area, Putalisadak",
      line2: "Kathmandu, Nepal",
    },
    image: dog5,
    fee: 1500,
  },
  {
    id: 14,
    name: "Coco",
    Breed: "Poodle",
    age: 2,
    gender: "Female",
    size: "Small",
    vaccinated: true,
    description: "Cute and loves attention.",
    location: "Pokhara, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Old Bazaar Heritage Area",
      line2: "Pokhara, Nepal",
    },
    image: poodle2,
    fee: 1450,
  },
  {
    id: 15,
    name: "Teddy",
    Breed: "Poodle",
    age: 3,
    gender: "Male",
    size: "Small",
    vaccinated: true,
    description: "Energetic and friendly, loves kids.",
    location: "Lalitpur, Nepal",
    // ✅ ADDED ADDRESS OBJECT
    address: { 
      line1: "Kupondole Height, Bagmati Bridge",
      line2: "Lalitpur, Nepal",
    },
    image: poodle3,
    fee: 1400,
  },
];