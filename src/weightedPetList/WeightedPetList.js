import React, { useState } from 'react';
import { petNameArray, StandardBonusesWeightMap } from '../itemMapping';
import PetItem from '../PetItem';
import {Checkbox} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const label = { inputProps: { 'aria-label': 'Include XP Weight' } };

export function weightedActivePetScore(data, pet, weightMap, includeXpFactor) {
    if (!pet?.petId || !data?.PetsCollection || !data?.PetsCollection[pet?.petId]) return 0;
    const petDatum = data.PetsCollection[pet.petId];
    console.log('\tscoring pet bonus list', petDatum)

    return petDatum.BonusList.filter((bonus) => {
        return bonus.ID < 1000;
    }).map((activePetBonus, i) => {
        const bonusBase = Number(1.0 + activePetBonus.Gain);
        const weight = weightMap[activePetBonus.ID]?.weight;
        let weightedResult = !!weight ? bonusBase * weight : bonusBase;
        if (includeXpFactor) weightedResult = weightedResult / petDatum.LevelXpRequired;
        console.log('\tweightedscore', activePetBonus, bonusBase, weight, weightedResult)
        return weightedResult;
    }).reduce((accum, item) => {
        accum += item;
        return accum;
    }, 0);
}
const WeightedPetList = ({ data, weightMap }) => {
    const [includeXpFactor, setIncludeXpFactor] = useState(true);
    const renderPet = (petData) => {
        const { petId } = petData;

        return (
            <PetItem
                key={petId}
                petData={petData}
                data={data}
                isSelected={true}
                onClick={() => false}
                weightMap={weightMap}
                petScoreFn={(pet) => weightedActivePetScore(data, pet, weightMap, includeXpFactor)}
            />
        );
    };

    const sortedPets = petNameArray
        .map(petData => {
            return {
                ...petData,
                weightedActivePetScore: weightedActivePetScore(data, petData, weightMap, includeXpFactor)
            };
        })
        .sort((a, b) => {
        return a?.weightedActivePetScore < b?.weightedActivePetScore;
    });

    return (
        <Grid2 container spacing={1}>
            <Grid2 xs={12}>
                <Checkbox {...label} defaultChecked size="small" />
            </Grid2>
            <Grid2 xs={12}>
                {sortedPets.map(renderPet)}
            </Grid2>
        </Grid2>
    );
};

export default WeightedPetList;
