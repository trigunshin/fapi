import React from 'react';
import './JSONDisplay.css'; // Add this line to import the CSS file
import PetNames from './itemMapping'


const calculateGroupScore = (group) => {
    let groupScore = 0;
    let dmgCount = 0;
    let timeCount = 0;
    const typeCounts = {};

    group.forEach((pet) => {
        groupScore += pet.BaseDungeonDamage * (1 + pet.Rank * 0.02);

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
    });

    let synergyBonus = 0;
    for (const type in typeCounts) {
        if (typeCounts[type] >= 2) {
            synergyBonus += 0.5;
        } else if (typeCounts[type] === 1) {
            synergyBonus += 0.25
        }
    }

    groupScore *= (1 + dmgCount * 0.1);
    groupScore *= (1 + timeCount * 0.05);
    groupScore *= (0.5 + synergyBonus);

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


const getItemName = (itemId) => {
    const item = PetNames[itemId];
    return item ? item.name : `Unknown (${itemId})`;
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
        // console.log('selected items includes', pet.ID, selectedItems)
        return isSelected(pet.ID)
});

    const groups = findBestGroups(filteredPets);

    const renderGroup = (group) => {
        return group.map((pet) => {
            const itemName = getItemName(pet.ID);
            const imageUrl = `/fapi/pets/${itemName}.png`;
            return (
                <div key={pet.ID}>
                    <div>{itemName}</div>
                    <img src={imageUrl} alt={itemName} />
                </div>
            );
        });
    };

    return (
        <div className="JSONDisplay">
            {groups.map((group, index) => (
                <div key={index}>
                    <h3>Group {index + 1} ({calculateGroupScore(group)})</h3>
                    <div className="group-container">{renderGroup(group)}</div>
                </div>
            ))}
        </div>
    );
};
export default JSONDisplay;
