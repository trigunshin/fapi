import React from 'react';

import PetNames from './itemMapping'

function findBestGroups(petsCollection) {
    const calculateScore = (pet) => pet.BaseDungeonDamage * (1 + pet.Rank * 0.02);

    const sortedPets = petsCollection.sort((a, b) => calculateScore(b) - calculateScore(a));

    const type0Pets = sortedPets.filter((pet) => pet.Type === 0);
    const type1Pets = sortedPets.filter((pet) => pet.Type === 1);

    const groups = [];

    for (let i = 0; i < 4; i++) {
        const group = [];

        if (type0Pets.length >= 2 && type1Pets.length >= 2) {
            group.push(type0Pets.shift(), type0Pets.shift(), type1Pets.shift(), type1Pets.shift());
        } else {
            group.push(...type0Pets.splice(0, 4 - group.length));
            group.push(...type1Pets.splice(0, 4 - group.length));
        }

        groups.push(group);
    }

    return groups;
}

const getItemName = (itemId) => {
    const item = PetNames[itemId];
    return item ? item.name : `Unknown (${itemId})`;
};


const JSONDisplay = ({ data }) => {
    const groups = findBestGroups(data.PetsCollection);

    return (
        <div className="JSONDisplay">
            {groups.map((group, index) => (
                <div key={index}>
                    <h3>Group {index + 1}</h3>
                    <p>
                        Names:{' '}
                        {group
                            .map((pet) => getItemName(pet.ID))
                            .join(', ')}
                    </p>
                </div>
            ))}
        </div>
    );
};
export default JSONDisplay;
