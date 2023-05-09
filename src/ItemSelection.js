import React from 'react';
import './ItemSelection.css';
import { petNameArray } from './itemMapping';
import PetItem from './PetItem';

const ItemSelection = ({ selectedItems, onItemSelected, data, weightMap }) => {
    const isSelected = (petId) => {
        return selectedItems.includes(petId);
    };

    const handleItemClick = (petId) => {
        if (isSelected(petId)) {
            onItemSelected(selectedItems.filter((id) => id !== petId));
        } else {
            onItemSelected([...selectedItems, petId]);
        }
    };

    const renderPet = (petData) => {
        const { petId } = petData;
        const isItemSelected = isSelected(petId);

        return (
            <PetItem
                key={petId}
                petData={petData}
                data={data}
                isSelected={isItemSelected}
                onClick={() => handleItemClick(petId)}
                weightMap={weightMap}
            />
        );
    };

    return (
        <div className="item-selection">
            {petNameArray.map(renderPet)}
        </div>
    );
};

export default ItemSelection;
