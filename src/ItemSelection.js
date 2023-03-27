import React from 'react';
import './ItemSelection.css';
import { petNameArray } from './itemMapping';

const ItemSelection = ({ selectedItems, onItemSelected }) => {
    const selectedItemsById = selectedItems.reduce((accum, item) => {
        accum[item] = parseInt(item, 10);
        return accum;
    }, {})
    const isSelected = (petId) => {
        return !!selectedItemsById[parseInt(petId, 10)];
    };

    const handleItemClick = (petId) => {
        if (isSelected(petId)) {
            onItemSelected(selectedItems.filter((id) => id !== petId));
        } else {
            onItemSelected([...selectedItems, petId]);
        }
    };
console.log('itemselection', petNameArray)
    return (
        <div className="item-selection">
            {petNameArray.map((petData) => (
                <div
                    key={petData.petId}
                    className={`item-tile${isSelected(petData.petId) ? '' : ' unselected'}`}
                    onClick={() => handleItemClick(petData.petId)}
                >
                    <img
                        src={petData.img}
                        alt={petData.name}
                        className={`item-image${isSelected(petData.petId) ? '' : ' unselected'}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default ItemSelection;
