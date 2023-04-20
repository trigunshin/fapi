import React from 'react';
import './JSONDisplay.css'; // Add this line to import the CSS file
import {BonusMap, petNameArray} from './itemMapping';
import PetItem from './PetItem';

const EXP_DMG_MOD = .1;
const EXP_TIME_MOD = .05;
const SYNERGY_MOD_STEP = .25;

function calculatePetBaseDamage(pet) {
    const result = pet?.BaseDungeonDamage * (1.0 + pet?.Rank * 0.05);
    return Number(result);
}

const calculateGroupScore = (group) => {
    let groupScore = 0;
    let dmgCount = 0;
    let timeCount = 0;
    let synergyBonus = 0;
    let baseGroupScore = 0;
    const typeCounts = {};

    group.forEach((pet) => {
        groupScore += calculatePetBaseDamage(pet);
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

const findBestGroups = (petsCollection) => {
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
    );
}

const JSONDisplay = ({ data, selectedItems }) => {
    if (!data || !data.PetsCollection) {
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

    const groups = findBestGroups(filteredPets);

    const renderGroup = (group) => {
        return group.map((petData) => {
            const { ID } = petData;
            const staticPetData = petNameArray.find(staticPetDatum => staticPetDatum.petId === ID)

            return (
                <PetItem
                    key={ID}
                    petData={staticPetData}
                    data={data}
                    isSelected={true}
                    onClick={() => {}}
                />
            );
        });
    };

    return (
        <div className="JSONDisplay">
            {groups.map((group, index) => {
                const score = calculateGroupScore(group).groupScore;
                const displayedDamage = group
                    .map(pet => calculatePetBaseDamage(pet) * 5 * data?.PetDamageBonuses)
                    .reduce((accum, dmg) => accum += dmg, Number(0))
                    .toExponential(2);
                const totalScore = Number(
                    Number(data?.PetDamageBonuses) * score * 5
                ).toExponential(2);
                return (
                    <div key={index}>
                        <div className="groups-header-container">
                            <div className="groups-item-tile">
                                <h3>Group {index + 1} Damage: {displayedDamage}</h3>
                            </div>
                            <div className="groups-tooltip">
                                <span className="groups-tooltip-content">
                                    <h3>Group Score ({totalScore})</h3>
                                    <ScoreSection data={data} group={group} totalScore={totalScore} />
                                </span>
                            </div>
                        </div>
                        <div className="group-container">{renderGroup(group)}</div>
                    </div>
                );
            })}
        </div>
    );
};
export default JSONDisplay;
