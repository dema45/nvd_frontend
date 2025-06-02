// candidatesByConstituency.js

import sonam from "../Assets/user1.jpeg"
import dorji from "../Assets/user4.jpeg";
import tshering from "../Assets/user5.jpeg";
import lhaki from "../Assets/user6.jpeg";

const candidatesByConstituency = {
  Bumthang: {
    "Chhoekhor-Tang": [
      {
        id: "bt-ct-pdp",
        name: "Sonam Wangchuk",
        partyName: "PDP",
        partySymbol: "Horse",
        photo: sonam
      },
      {
        id: "bt-ct-dnt",
        name: "Karma Dema",
        partyName: "DNT",
        partySymbol: "Sun",
        photo: dorji
      }
    ],
    "Chhumig-Ura": [
      {
        id: "bt-cu-dpt",
        name: "Tshering Penjor",
        partyName: "DPT",
        partySymbol: "Hammer",
        photo: tshering
      },
      {
        id: "bt-cu-btp",
        name: "Jigme Lhaki",
        partyName: "BTP",
        partySymbol: "Tree",
        photo: lhaki
      }
    ]
  },
  Chhukha: {
    "Bongo-Chapcha": [
      {
        id: "ch-bc-pdp",
        name: "Lhamo Tashi",
        partyName: "PDP",
        partySymbol: "Horse",
        photo: "/images/candidates/lhamo-tashi.jpg"
      },
      {
        id: "ch-bc-dnt",
        name: "Tenzin Norbu",
        partyName: "DNT",
        partySymbol: "Sun",
        photo: "/images/candidates/tenzin-norbu.jpg"
      }
    ],
    "Phuentshogthang": [
      {
        id: "ch-pt-dpt",
        name: "Sonam Jamtsho",
        partyName: "DPT",
        partySymbol: "Hammer",
        photo: "/images/candidates/sonam-jamtsho.jpg"
      },
      {
        id: "ch-pt-btp",
        name: "Dechen Lhamo",
        partyName: "BTP",
        partySymbol: "Tree",
        photo: "/images/candidates/dechen-lhamo.jpg"
      }
    ]
  },
  
};

export default candidatesByConstituency;
