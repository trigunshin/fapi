import React from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';

import './JSONDisplay.css'; // Add this line to import the CSS file
import {BonusMap, petNameArray} from './itemMapping';
import PetItem from './PetItem';
import ItemSelection from "./ItemSelection";
import MouseOverPopover from "./tooltip";
import Typography from "@mui/material/Typography";
import {calculateGroupScore, calculatePetBaseDamage, EXP_DMG_MOD, EXP_TIME_MOD} from "./App";


function ScoreSection({data, group, totalScore}) {
    const {baseGroupScore, dmgCount, timeCount, synergyBonus} = calculateGroupScore(group);
    return (
        <React.Fragment>
        <ul>
            <li>
                {Number(totalScore).toExponential(2)}&nbsp;~=&nbsp; 5 *
            </li>
            <li>
                Group Base: {Number(baseGroupScore).toExponential(2)}
            </li>
            <li>
                Dmg Bonus: {Number(1+dmgCount * EXP_DMG_MOD).toFixed(2)}x
            </li>
            <li>
                Time Bonus: {Number(1+timeCount * EXP_TIME_MOD).toFixed(2)}x
            </li>
            <li>
                Synergy: {Number(synergyBonus).toFixed(2)}x
            </li>
            <li>
                PetDmgMod: {Number(data?.PetDamageBonuses).toExponential(2)}
            </li>
        </ul>
        </React.Fragment>
    );
}

const JSONDisplay = ({ data, groups, selectedItems, handleItemSelected, weightMap }) => {
    if (!!data === false || !!data.PetsCollection === false) {
        return <div>Loading...</div>; // You can replace this with null or another element if you prefer
    }

    return (
        <div className="grid-container">
            <div className="grid-left">
                <Typography variant={"h5"} >Best Teams</Typography>
                {groups.reduce((accum, group, index) => {
                    const score = calculateGroupScore(group).groupScore;
                    const displayedDamage = group
                        .map((pet) => calculatePetBaseDamage(pet) * 5 * data?.PetDamageBonuses)
                        .reduce((accum, dmg) => (accum += dmg), Number(0))
                        .toExponential(2);
                    const totalScore = Number(Number(data?.PetDamageBonuses) * score * 5).toExponential(2);
                    const groupTooltip = (
                        <div className="groups-tooltip">
                            <span className="groups-tooltip-content">
                                <h3>Group Score ({totalScore})</h3>
                                <ScoreSection data={data} group={group} totalScore={totalScore} />
                            </span>
                        </div>
                    );
                    accum.push(
                        <div className="grid-row" key={(1 + index) * 9001}>
                            <MouseOverPopover tooltip={groupTooltip}>
                                Group {index + 1} Damage: {displayedDamage}
                            </MouseOverPopover>
                        </div>
                    )
                    accum.push(
                        <Grid2 container spacing={1} key={index}>
                            {!!group && group.map((petData, idx) => {
                                const { ID } = petData;
                                const staticPetData = petNameArray.find(staticPetDatum => staticPetDatum.petId === ID)

                                return (
                                    <Grid2 xs={3} key={idx}>
                                        <PetItem
                                            key={ID}
                                            petData={staticPetData}
                                            data={data}
                                            isSelected={true}
                                            onClick={() => {}}
                                            weightMap={weightMap}
                                        />
                                    </Grid2>
                                );
                            })}
                        </Grid2>
                    );
                    return accum;
                }, [])}
            </div>
            <div className="grid-right">
                <Typography variant={"h5"}>Highlighted: >0 rank pets (clickable)</Typography>
                <ItemSelection weightMap={weightMap} data={data} selectedItems={selectedItems} onItemSelected={handleItemSelected} />
            </div>
        </div>
    );
};
export default JSONDisplay;
