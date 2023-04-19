import React from 'react';
import './PetItem.css';

import {BonusMap} from "./itemMapping";

const filterBonuses = (bonuses, filterFn) => {
    return bonuses
        .filter(filterFn);
};

const PetItem = ({ petData, isSelected, onClick, data }) => {
    const { petId, img, name } = petData;

    // Find the pet from the data.PetsCollection
    const pet = data.PetsCollection.find(p => p.ID === parseInt(petId));

    if (!pet) return null; // In case the pet is not found in the collection

    const rank = pet.Rank;
    const level = pet.Level;
    const totalScore = Number(
        Number(data?.PetDamageBonuses) * pet.BaseDungeonDamage * (1.0 + rank * 0.05) * 5
    ).toExponential(2);

    const section1Bonuses = (
        <ul>
            {filterBonuses(pet.BonusList, (bonus) => {
                return bonus.ID < 1000;
            }).map((activePetBonus, i) => {
                const bonusBase = Number(1.0 + activePetBonus.Gain);
                const bonusPower = Number(pet.Level);
                const result = (Math.pow(bonusBase, bonusPower) - 1) * (1 + .02 * Number(pet.Rank));

                return (
                    <li key={i}>
                        {BonusMap[activePetBonus.ID]?.label}: {result.toExponential(2)}
                    </li>
                );
            })}
        </ul>
    );

    const section2Bonuses = (
        <ul>
            {filterBonuses(pet.BonusList, (bonus) => bonus.ID >= 1000 && bonus.ID < 5000)
                .map((activePetBonus, i) => {
                    return (
                        <li key={i}>
                            {BonusMap[activePetBonus.ID]?.label}: {Number(activePetBonus.Power).toExponential(2)}
                        </li>
                    );
                })}
        </ul>
    );

    return (
        <div
            key={petId}
            onClick={onClick}
            className={`item-tile ${isSelected ? '' : 'unselected'}`}
        >
            <div className="item-image-container">
                <div className="tooltip">
                    <span className="tooltip-content">
                        <h3>
                            {name} (Level: {level}) (Rank: {rank}) ({totalScore})
                        </h3>
                        <span>
                            <h4>Active Bonuses</h4>
                            {section1Bonuses}
                        </span>
                        <span>
                            <h4>Expedition Bonuses:</h4>
                            {section2Bonuses}
                        </span>
                    </span>
                </div>
                <img src={img} alt={name} className="item-image" />
            </div>
        </div>
    );
};

export default PetItem;
