import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import JSONDisplay from './JSONDisplay';
import RepoLink from './RepoLink';
import { petNameArray } from './itemMapping';
import ItemSelection from './ItemSelection';

const defaultPetSelection = petNameArray.map(petData => petData.petId);

function App() {
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState(null);
    const [selectedItems, setSelectedItems] = useState(defaultPetSelection);

    const handleData = (uploadedData) => {
        setData(uploadedData);
        const positiveRankedPets = uploadedData.PetsCollection.filter(
            (pet) => pet.Rank
        ).map((pet) => pet.ID);
        setSelectedItems(positiveRankedPets);
    };

    const handleItemSelected = (items) => {
        setProcessing(true);
        setTimeout(() => {
            setSelectedItems(items);
            setProcessing(false);
        }, 1000); // Adjust the duration as needed
    };


    return (
        <div className="App">
            <RepoLink />
            {processing && (
                <div className="processing-message">
                    Processing... {/* Replace this with a loading spinner or any other message you'd like to show */}
                </div>
            )}

            <div className="main-content">
                {data ? (
                    <JSONDisplay data={data} selectedItems={selectedItems} />
                ) : (
                    <FileUpload onData={handleData} />
                )}
                {data ? (
                    <ItemSelection selectedItems={selectedItems} onItemSelected={handleItemSelected} />
                    ) : (
                    <div></div>
                    )}
            </div>
        </div>
    );
}

export default App;
