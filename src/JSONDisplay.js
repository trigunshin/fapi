import React from 'react';
import Grid from '@mui/material/Grid';

import './JSONDisplay.css'; // Add this line to import the CSS file
import {BonusMap, petNameArray} from './itemMapping';
import PetItem from './PetItem';
import ItemSelection from "./ItemSelection";
import MouseOverPopover from "./tooltip";
import Typography from "@mui/material/Typography";

const EXP_DMG_MOD = .1;
const EXP_TIME_MOD = .05;
const SYNERGY_MOD_STEP = .25;

function calculatePetBaseDamage(pet, defaultRank) {
    const rankCount = defaultRank ? defaultRank : pet?.Rank;
    const result = pet?.BaseDungeonDamage * (1.0 + rankCount * 0.05);
    return Number(result);
}

const calculateGroupScore = (group, defaultRank) => {
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

const findBestGroups = (petsCollection, defaultRank) => {
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

    return bestGroups;
};

function ScoreSection({data, group, totalScore}) {
    const {baseGroupScore, dmgCount, timeCount, synergyBonus} = calculateGroupScore(group);
    return (
        <React.Fragment>
        <ul>
            <li>
                {Number(totalScore).toExponential(2)}&nbsp;~=&nbsp; 5 *
            </li>
            <li>
                Group Base: {Number(baseGroupScore).toExponential(2)}
            </li>
            <li>
                Dmg Bonus: {Number(1+dmgCount * EXP_DMG_MOD).toFixed(2)}x
            </li>
            <li>
                Time Bonus: {Number(1+timeCount * EXP_TIME_MOD).toFixed(2)}x
            </li>
            <li>
                Synergy: {Number(synergyBonus).toFixed(2)}x
            </li>
            <li>
                PetDmgMod: {Number(data?.PetDamageBonuses).toExponential(2)}
            </li>
        </ul>
        </React.Fragment>
    );
}

const JSONDisplay = ({ data, selectedItems, defaultRank, handleItemSelected }) => {
    if (!!data === false || !!data.PetsCollection === false) {
        return <div>Loading...</div>; // You can replace this with null or another element if you prefer
    }
    const selectedItemsById = selectedItems.reduce((accum, item) => {
        accum[item] = parseInt(item, 10);
        return accum;
    }, {})
    const isSelected = (petId) => {
        return !!selectedItemsById[parseInt(petId, 10)];
    };
    const filteredPets = data.PetsCollection.filter((pet) => {
        return isSelected(pet.ID)
    });

    const groups = findBestGroups(filteredPets, defaultRank);

    return (
        <div className="grid-container">
            <div className="grid-left">
                <Typography variant={"h5"} >Best Teams</Typography>
                {groups.reduce((accum, group, index) => {
                    const score = calculateGroupScore(group).groupScore;
                    const displayedDamage = group
                        .map((pet) => calculatePetBaseDamage(pet) * 5 * data?.PetDamageBonuses)
                        .reduce((accum, dmg) => (accum += dmg), Number(0))
                        .toExponential(2);
                    const totalScore = Number(Number(data?.PetDamageBonuses) * score * 5).toExponential(2);
                    const groupTooltip = (
                        <div className="groups-tooltip">
                            <span className="groups-tooltip-content">
                                <h3>Group Score ({totalScore})</h3>
                                <ScoreSection data={data} group={group} totalScore={totalScore} />
                            </span>
                        </div>
                    );
                    accum.push(
                        <div className="grid-row" key={(1 + index) * 9001}>
                            <MouseOverPopover tooltip={groupTooltip}>
                                Group {index + 1} Damage: {displayedDamage}
                            </MouseOverPopover>
                        </div>
                    )
                    accum.push(
                        <div className="grid-row" key={index}>
                            <Grid container spacing={1}>
                                {!!group && group.map((petData) => {
                                    const { ID } = petData;
                                    const staticPetData = petNameArray.find(staticPetDatum => staticPetDatum.petId === ID)

                                    return (
                                        <Grid xs={3}>
                                            <PetItem
                                                key={ID}
                                                petData={staticPetData}
                                                data={data}
                                                isSelected={true}
                                                onClick={() => {}}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </div>
                    );
                    return accum;
                }, [])}
            </div>
            <div className="grid-right">
                <Typography variant={"h5"}>Highlighted: >0 rank pets (clickable)</Typography>
                <ItemSelection data={data} selectedItems={selectedItems} onItemSelected={handleItemSelected} />
            </div>
        </div>
    );
};
export default JSONDisplay;
