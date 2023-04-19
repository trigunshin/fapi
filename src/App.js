import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import JSONDisplay from './JSONDisplay';
import RepoLink from './RepoLink';
import { petNameArray } from './itemMapping';
import ItemSelection from './ItemSelection';

const defaultPetSelection = petNameArray.map(petData => petData.petId);

function App() {
    const [data, setData] = useState(null);
    const [selectedItems, setSelectedItems] = useState(defaultPetSelection);

    const handleData = (uploadedData) => {
        setData(uploadedData);
        console.log(uploadedData)
        const positiveRankedPets = uploadedData.PetsCollection.filter(
            (pet) => pet.Rank
        ).map((pet) => pet.ID);
        setSelectedItems(positiveRankedPets);
    };

    const handleItemSelected = (items) => {
        setSelectedItems(items);
    };
console.log('app.selecteditems', selectedItems);

    return (
        <div className="App">
            <RepoLink />
            <div className="main-content">
                {data ? (
                    <JSONDisplay data={data} selectedItems={selectedItems} />
                ) : (
                    <FileUpload onData={handleData} />
                )}
                {data ? (
                    <ItemSelection data={data} selectedItems={selectedItems} onItemSelected={handleItemSelected} />
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default App;
