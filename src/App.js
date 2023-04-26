import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import JSONDisplay from './JSONDisplay';
import RepoLink from './RepoLink';
import CardComponent from './cards/card';
import { petNameArray } from './itemMapping';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import { Container, Box } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5'
        }
    },
    typography: {
        fontFamily: 'Roboto',
    },
});

const defaultPetSelection = petNameArray.map(petData => petData.petId);

export const EXP_DMG_MOD = .1;
export const EXP_TIME_MOD = .05;
export const SYNERGY_MOD_STEP = .25;

export function calculatePetBaseDamage(pet, defaultRank) {
    const rankCount = defaultRank ? defaultRank : pet?.Rank;
    const result = pet?.BaseDungeonDamage * (1.0 + rankCount * 0.05);
    return Number(result);
}

export const calculateGroupScore = (group, defaultRank) => {
    let groupScore = 0;
    let dmgCount = 0;
    let timeCount = 0;
    let synergyBonus = 0;
    let baseGroupScore = 0;
    const typeCounts = {};

    group.forEach((pet) => {
        groupScore += calculatePetBaseDamage(pet, defaultRank);
        if (pet.BonusList.some((bonus) => bonus.ID === 1013)) {
            dmgCount++;
        }
        if (pet.BonusList.some((bonus) => bonus.ID === 1012)) {
            timeCount++;
        }

        // Count pet types
        if (typeCounts[pet.Type]) {
            typeCounts[pet.Type]++;
        } else {
            typeCounts[pet.Type] = 1;
        }
        if (pet.ID) synergyBonus += SYNERGY_MOD_STEP;
    });
    baseGroupScore = groupScore;
    const [earthType, airType] = Object.values(typeCounts);
    if (earthType > 0 && airType > 0) synergyBonus += SYNERGY_MOD_STEP;
    if (earthType > 1 && airType > 1) synergyBonus += SYNERGY_MOD_STEP;

    groupScore *= (1 + dmgCount * EXP_DMG_MOD);
    groupScore *= (1 + timeCount * EXP_TIME_MOD);
    groupScore *= synergyBonus;

    return {groupScore, baseGroupScore, dmgCount, timeCount, synergyBonus};
};

function getCombinations(array, k) {
    const combinations = new Set();
    const f = (start, prevCombination) => {
        if (prevCombination.length > 0 && prevCombination.length <= k && prevCombination.every((pet) => pet?.ID !== undefined)) {
            const sortedIds = prevCombination.sort((a, b) => a.ID - b.ID).map((pet) => pet.ID).join(',');
            combinations.add(sortedIds);
        }
        if (prevCombination.length === k) {
            return;
        }
        for (let i = start; i < array.length; i++) {
            f(i + 1, [...prevCombination, array[i]]);
        }
    };
    f(0, []);
    return Array.from(combinations).map((combination) => combination.split(',').map((id) => array.find((pet) => pet.ID === parseInt(id))));
}

export const findBestGroups = (petsCollection, defaultRank) => {
    const k = 4; // Size of each group
    const numGroups = 6; // Number of groups to find
    const memo = {};

    const memoizedGroupScore = (group) => {
        const key = group.map((pet) => pet.ID).join(',');
        if (!memo[key] || memo[key]) {
            memo[key] = calculateGroupScore(group)?.groupScore;
        }
        return memo[key];
    };

    let bestGroups = [];
    for (let g = 0; g < numGroups; g++) {
        const combinations = getCombinations(petsCollection, Math.min(k, petsCollection.length));
        if (combinations.length === 0) {
            break;
        }
        const bestGroup = combinations.reduce((best, group) => {
            const score = memoizedGroupScore(group);
            return score > memoizedGroupScore(best) ? group : best;
        }, combinations[0]);

        if (bestGroup) {
            bestGroups.push(bestGroup);
            petsCollection = petsCollection.filter((pet) => !bestGroup.includes(pet));
        }
    }
console.log('foundbest', bestGroups,' from', petsCollection)
    return bestGroups;
};

let groupCache = {};
function setGroupCache(newCache) {
    groupCache = newCache;
}

function App() {
    const [data, setData] = useState(null);
    const [groups, setGroups] = useState([]);
    const [defaultRank, setDefaultRank] = useState(0);
    const [includeLocked, setIncludeLocked] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultPetSelection);
    const [tabSwitch, setTabSwitch] = useState(0);

    const handleItemSelected = (items) => {
        setSelectedItems(items);

        if (items) handleGroups(data, items);
    };

    const selectComponent = () => {
        switch (tabSwitch) {
            case 2:
                return <CardComponent data={data} />;
            case 1:
                return <JSONDisplay data={data} groups={groups} selectedItems={selectedItems} handleItemSelected={handleItemSelected} />;
            case 0:
                return <FileUpload onData={handleData} />;
            default:
                return <FileUpload onData={handleData} />;
        }
    };

    const handleData = (uploadedData) => {
        setData(uploadedData);
        setGroupCache({});
        console.log(uploadedData)
        const positiveRankedPets = uploadedData.PetsCollection.filter(
            (pet) => {
                const isValidRank = defaultRank ? true : !!pet.Rank;
                const isValidLocked = includeLocked ? true : !!pet.Locked;
                return isValidRank && isValidLocked;
            }
        ).map((pet) => pet.ID);
        setSelectedItems(positiveRankedPets);

        handleGroups(uploadedData, positiveRankedPets);
        if (tabSwitch === 0) setTabSwitch(1);  // move upload to expedition when done
    };

    const handleGroups = (data, selectedItems) => {
        const petData = data?.PetsCollection || [];
        const selectedItemsById = petData.reduce((accum, item) => {
            accum[parseInt(item.ID, 10)] = item;
            return accum;
        }, {})

        const localPets = selectedItems.map(petId => selectedItemsById[petId])
        const keyString = selectedItems.sort().join(',');
        let groups = groupCache[keyString];
        if (groups) {
            setGroups(groups);
        } else {
            groups = findBestGroups(localPets, defaultRank);
            setGroupCache({...groupCache, [keyString]: groups})
            setGroups(groups);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <RepoLink />
            <Container>
                <Box sx={{ flexGrow: 1 }}>
                    {selectComponent()}
                </Box>
                <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
                    <BottomNavigation
                        showLabels
                        value={tabSwitch}
                        onChange={(event, newValue) => setTabSwitch(newValue)}
                    >
                        <BottomNavigationAction label="Upload" icon={<InfoIcon />} />
                        {!!data && <BottomNavigationAction label="Expedition" icon={<InfoIcon />} />}
                        {!!data && <BottomNavigationAction label="Cards" icon={<BadgeIcon />} />}
                    </BottomNavigation>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
