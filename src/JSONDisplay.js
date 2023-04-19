import React from 'react';
import './JSONDisplay.css'; // Add this line to import the CSS file
import { petNameArray } from './itemMapping';
import PetItem from './PetItem';

function calculatePetBaseDamage(pet) {
    const result = pet?.BaseDungeonDamage * (1.0 + pet?.Rank * 0.05);
    return Number(result);
}

const calculateGroupScore = (group) => {
    let groupScore = 0;
    let dmgCount = 0;
    let timeCount = 0;
    let synergyBonus = 0;
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
        if (pet.ID) synergyBonus += 0.25;
    });
    const [earthType, airType] = Object.values(typeCounts);
    if (earthType > 0 && airType > 0) synergyBonus += .25;
    if (earthType > 1 && airType > 1) synergyBonus += .25;

    groupScore *= (1 + dmgCount * 0.1);
    groupScore *= (1 + timeCount * 0.05);
    groupScore *= synergyBonus;

    return groupScore;
};
const findBestGroups = (petsCollection) => {
    const k = 4; // Size of each group
    const numGroups = 6; // Number of groups to find

    const getCombinations = (array, k) => {
        const combinations = [];
        const f = (start, prevCombination) => {
            if (prevCombination.length === k) {
                combinations.push(prevCombination);
                return;
            }
            for (let i = start; i < array.length; i++) {
                f(i + 1, [...prevCombination, array[i]]);
            }
        };
        f(0, []);
        return combinations;
    };

    let bestGroups = [];
    for (let g = 0; g < numGroups; g++) {
        const combinations = getCombinations(petsCollection, k);
        const bestGroup = combinations.reduce((best, group) => {
            const score = calculateGroupScore(group);
            return score > calculateGroupScore(best) ? group : best;
        }, combinations[0]);

        bestGroups.push(bestGroup);
        petsCollection = petsCollection.filter((pet) => !bestGroup.includes(pet));
    }

    return bestGroups;
};

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
                const score = calculateGroupScore(group);
                const displayedDamage = group
                    .map(pet => calculatePetBaseDamage(pet) * 5 * data?.PetDamageBonuses)
                    .reduce((accum, dmg) => accum += dmg, Number(0))
                    .toExponential(2);
                const totalScore = Number(
                    Number(data?.PetDamageBonuses) * score * 5
                ).toExponential(2);
                return (
                    <div key={index}>
                        <h3>Group {index + 1} Damage: {displayedDamage} Scores: ({score.toFixed(2)}) ({totalScore})</h3>
                        <h5></h5>
                        <div className="group-container">{renderGroup(group)}</div>
                    </div>
                );
            })}
        </div>
    );
};
export default JSONDisplay;
