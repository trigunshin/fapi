import React from 'react';
import './JSONDisplay.css'; // Add this line to import the CSS file
import PetNames from './itemMapping'


const calculateGroupScore = (group) => {
    let groupScore = 0;
    let dmgCount = 0;
    let timeCount = 0;

    group.forEach((pet) => {
        groupScore += pet.BaseDungeonDamage * (1 + pet.Rank * 0.02);
        if (pet.BonusList.some((bonus) => bonus.ID === 1013)) {
            dmgCount++;
        }
        if (pet.BonusList.some((bonus) => bonus.ID === 1012)) {
            timeCount++;
        }
    });

    groupScore *= 1 + dmgCount * 0.1;
    groupScore *= 1 + timeCount * 0.05;

    return groupScore;
};

const findBestGroups = (petsCollection) => {
    const k = 4; // Size of each group
    const numGroups = 6; // Number of groups to find
    const memo = new Map();

    const findBestDynamic = (pets, groups) => {
        if (groups.length === numGroups) {
            return groups;
        }

        const key = pets.map((pet) => pet.ID).join('-');
        if (memo.has(key)) {
            return memo.get(key);
        }

        let bestGroups = [];
        let bestScore = -Infinity;

        for (let i = 0; i <= pets.length - k; ++i) {
            const newGroup = pets.slice(i, i + k);
            const remainingPets = [...pets.slice(0, i), ...pets.slice(i + k)];
            const nextGroups = findBestDynamic(remainingPets, [...groups, newGroup]);

            const totalScore = nextGroups.reduce((sum, group) => sum + calculateGroupScore(group), 0);
            if (totalScore > bestScore) {
                bestGroups = nextGroups;
                bestScore = totalScore;
            }
        }

        memo.set(key, bestGroups);
        return bestGroups;
    };

    return findBestDynamic(petsCollection, []);
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
