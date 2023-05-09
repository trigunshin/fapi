const PetNames = {
    1: {
        "name": "Cocorico",
        "location": "3-2",
    },
    2: {
        "name": "Rico",
        "location": "3-2",
    },
    3: {
        "name": "Trevor",
        "location": "3-3",
    },
    4: {
        "name": "Bingo",
        "location": "3-4",
    },
    5: {
        "name": "Primfeet",
        "location": "3-6",
    },
    6: {
        "name": "Nidhogg",
        "location": "4-1",
    },
    7: {
        "name": "Vidar",
        "location": "3-5",
    },
    8: {
        "name": "Hiko",
        "location": "3-7",
    },
    9: {
        "name": "Murphy",
        "location": "3-8",
    },
    10: {
        "name": "Aphrodite",
        "location": "3-9",
    },
    11: {
        "name": "Nuts",
        "location": "4-2",
    },
    12: {
        "name": "Alvin",
        "location": "4-7",
    },
    13: {
        "name": "Flash",
        "location": "4-4",
    },
    14: {
        "name": "Cid",
        "location": "4-3",
    },
    15: {
        "name": "Tango",
        "location": "4-5",
    },
    16: {
        "name": "Darti",
        "location": "4-6",
    },
    17: {
        "name": "Arizona",
        "location": "4-9",
    },
    18: {
        "name": "Suijin",
        "location": "5-1",
    },
    19: {
        "name": "Johny Be Good",
        "location": "4-8",
    },
    20: {
        "name": "Nucifera",
        "location": "5-2",
    },
    21: {
        "name": "Barney",
        "location": "5-3",
    },
    22: {
        "name": "Seth",
        "location": "5-4",
    },
    23: {
        "name": "Plyne",
        "location": "5-5",
    },
    24: {
        "name": "Zac",
        "location": "5-6",
    },
    25: {
        "name": "Tock",
        "location": "5-7",
    },
    26: {
        "name": "The Governess",
        "location": "5-8",
    },
    27: {
        "name": "Swamp King",
        "location": "5-9",
    },
    28: {
        "name": "Itzamna",
        "location": "6-1",
    },
    29: {
        "name": "Julian",
        "location": "6-2",
    },
    30: {
        "name": "Yuhuang",
        "location": "6-3",
    },
    31: {
        "name": "Serket",
        "location": "E1C",
    },
    32: {
        "name": "Fujin",
        "location": "E1R",
    },
    33: {
        "name": "Ulrich",
        "location": "E2C",
    },
    34: {
        "name": "Huginn",
        "location": "E2R",
    },
    35: {
        "name": "Esus",
        "location": "E3C",
    },
    36: {
        "name": "Hera",
        "location": "E3R",
    },
    37: {
        "name": "Asterios",
        "location": "E4C",
    },
    38: {
        "name": "Odile",
        "location": "E4R",
    },
    39: {
        "name": "Anubis",
        "location": "E5C",
    },
    40: {
        "name": "Garuda",
        "location": "E5R",
    },
    41: {
        "name": "Tsukuyomi",
        "location": "E6C",
    },
    42: {
        "name": "Nanbozo",
        "location": "E6R",
    },
    43: {
        "name": "Ra",
        "location": "E7C",
    },
    44: {
        "name": "Vishnou",
        "location": "E7R",
    },
    45: {
        "name": "Icare",
        "location": "E8C",
    },
    46: {
        "name": "Olaf",
        "location": "E8R",
    },
    47: {
        "name": "Fafnir",
        "location": "E9C",
    },
    48: {
        "name": "Quetzalcoalt",
        "location": "E9R",
    },
    49: {
        "name": "Professor Inderwind",
        "location": "E10C",
    },
    50: {
        "name": "Dangun",
        "location": "E10R",
    },
    51: {
        "name": "Wako",
        "location": "6-4",
    },
    52: {
        "name": "Papyru",
        "location": "6-5",
    },
    53: {
        "name": "Sigma",
        "location": "6-6",
    },
    54: {
        "name": "Louna",
        "location": "6-7",
    },
    55: {
        "name": "Babou",
        "location": "6-8",
    },
    56: {
        "name": "Niord",
        "location": "6-9",
    },
    57: {
        "name": "Mous",
        "location": "7-1",
    },
    58: {
        "name": "Flafy",
        "location": "7-2",
    },
    59: {
        "name": "Nick",
        "location": "7-3",
    },
    60: {
        "name": "Cherry",
        "location": "7-4",
    },
    61: {
        "name": "Abby",
        "location": "E11C",
    },
    62: {
        "name": "Noop",
        "location": "E11R",
    },
    63: {
        "name": "Juba",
        "location": "E12C",
    },
    64: {
        "name": "David",
        "location": "E12R",
    },
    65: {
        "name": "Viktor",
        "location": "E13C",
    },
    66: {
        "name": "Darko",
        "location": "E13R",
    },
    67: {
        "name": "Ubel",
        "location": "E14C",
    },
    68: {
        "name": "Than",
        "location": "E14R",
    },
    69: {
        "name": "Hirma",
        "location": "E15C",
    },
    70: {
        "name": "Boletus",
        "location": "E14R",
    },
}
export default PetNames;

export function getImageUrl(itemName) {
    return `/fapi/pets/${itemName}.png`;
}

export const petNameArray = Object.entries(PetNames).map(([key, value]) => {
    return {
        ...value,
        'petId': parseInt(key, 10),
        'img': getImageUrl(value.name)
    };
})

export const petNamesById = petNameArray.reduce((accum, petNameData) => {
    accum[petNameData.petId] = petNameData;
    return accum;
}, {});

export const BonusMap = {
    1: {id: 1, label: "Potato"},
    2: {id: 2, label: "Class Exp"},
    3: {id: 3, label: "Skull"},
    4: {id: 4, label: "Confection Exp"},
    5: {id: 5, label: "Reincarnation Exp"},
    6: {id: 6, label: "Item Rating"},
    7: {id: 7, label: "Poop BONUS"},
    8: {id: 8, label: "Milk BONUS"},
    9: {id: 9, label: "Whack SCORE"},
    10: {id: 10, label: "Brewing EXP"},
    11: {id: 11, label: "Calcium EXP"},
    12: {id: 12, label: "Fermenting EXP"},
    13: {id: 13, label: "Residue BONUS"},
    14: {id: 14, label: "Worm QTY"},
    15: {id: 15, label: "Larva QTY"},
    16: {id: 16, label: "Larva EFF"},
    17: {id: 17, label: "ATTACK HP"},
    18: {id: 18, label: "Pet DMG"},
    19: {id: 19, label: "Pet LEVEL EXP"},
    20: {id: 20, label: "Pet RANK EXP"},
    21: {id: 21, label: "Card POWER B"},
    22: {id: 22, label: "Card EXP B"},
    26: {id: 26, label: "Reinc Point Bonus"},
    1001: {id: 1001, label: "POTATO GAIN"},
    1002: {id: 1002, label: "CLASS EXP GAIN"},
    1003: {id: 1003, label: "SKULL GAIN"},
    1004: {id: 1004, label: "WORM QTY GAIN"},
    1005: {id: 1005, label: "POOP GAIN"},
    1006: {id: 1006, label: "LARVA QTY GAIN"},
    1007: {id: 1007, label: "WHACK GAIN"},
    1008: {id: 1008, label: "MILK GAIN"},
    1009: {id: 1009, label: "RESIDUE GAIN"},
    1010: {id: 1010, label: "CARD POWER GAIN"},
    1011: {id: 1011, label: "DUNGEON EFF"},
    1012: {id: 1012, label: "DUNGEON TIME GAIN"},
    1013: {id: 1013, label: "DUNGEON DMG"},
    1014: {id: 1014, label: "CARD EXP"},
    1015: {id: 1015, label: "REINC PTS GAIN"},
    1016: {id: 1015, label: "EXPE TOKEN GAIN"},
    5001: {id: 5001, label: "Spawn More Potatoes"},
    5002: {id: 5002, label: "Fewer Potatoes"},
    5003: {id: 5003, label: "Potatoes Spawn Speed"},
    5004: {id: 5004, label: "Minimum Rarity"},
    5005: {id: 5005, label: "Base Residue"},
    5006: {id: 5006, label: "Drop Bonuses Cap"},
    5007: {id: 5007, label: "Expedition Reward"},
    5008: {id: 5008, label: "Combo Pet Damage"},
    5009: {id: 5009, label: "Breeding Timer"},
    5010: {id: 5010, label: "Milk Timer"},
    5011: {id: 5011, label: "Attack Speed"},
    5012: {id: 5012, label: "Whack Buff Timer"},
    5013: {id: 5013, label: "Breeding and Milk Timer"},
    5014: {id: 5014, label: "Faster Charge Tick"},
};

const standardBonusesWeightListCount = Array.from({length: 22}, (x, i) => i);
export const standardBonusesWeightList = standardBonusesWeightListCount.map((idx, i) => BonusMap[i+1]);
export const standardBonusesWeightById = standardBonusesWeightListCount.reduce((accum, item, i) => {
    accum[i] = item;
    return accum;
}, {});
export const DefaultWeightMappings = {
    1: {id: 1, weight: .0015},
    2: {id: 2, weight: .003},
    3: {id: 3, weight: .003},
    4: {id: 4, weight: .0001},
    5: {id: 5, weight: 100},
    6: {id: 6, weight: 50},
    7: {id: 7, weight: .001},
    8: {id: 8, weight: .029},
    9: {id: 9, weight: 0.001},
    10: {id: 10, weight: .0001},
    11: {id: 11, weight: .0001},
    12: {id: 12, weight: .0001},
    13: {id: 13, weight: 3.051},
    14: {id: 14, weight: .0029},
    15: {id: 15, weight: .001},
    16: {id: 16, weight: .001},
    17: {id: 17, weight: .005},
    18: {id: 18, weight: 200},
    19: {id: 19, weight: 10},
    20: {id: 20, weight: 10},
    21: {id: 21, weight: 201},
    22: {id: 22, weight: 10},
    26: {id: 26, weight: 50},
}
const StandardBonusesWeightMap = standardBonusesWeightList.reduce((accum, item, i) => {
    const newItem = {
        ...item, // should be BonusMap {id, label}
        weight: DefaultWeightMappings[item.id].weight
    };

    accum[item.id] = newItem;
    return {...accum};
}, {});
export const DefaultWeightMap = StandardBonusesWeightMap;