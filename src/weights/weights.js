import React, { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import { makeStyles } from '@material-ui/core/styles';

const Weight = function WeightComponent({id, label, value, setValue}) {
    const displayValue = value;
    const updateWeights = (id, newValue) => setValue(id, newValue);
    return (
        <Grid2 xs={2}>
            <TextField id="filled-basic" label={`${label} (${id})`} variant="filled" value={displayValue}
                       onChange={(e) => updateWeights(id, e.target.value)}
            />
        </Grid2>
    );
}

export default function Weights({weightMap, setWeightsProp}) {
    // generate me in APP to manage save/load lifecycle? or keep that here
    const weightList = Object.values(weightMap);
    const updateWeights = (id, newValue) => {
        const updated = {...weightMap[id], weight: newValue};
        setWeightsProp({...weightMap, [id]: updated });
    };
    return (
        <Grid2 container spacing={.5}>
            <Grid2 xs={12}>
                <Typography variant={"h2"}>Weights</Typography>
            </Grid2>
            <Grid2 xs={12}>
                <Typography variant={"Body"}>Used in Card pane.</Typography>
            </Grid2>
            {weightList.map(({id, label, weight}, i) => {
                return (
                    <Weight id={id} label={label} value={Number(weight).toFixed(5)} setValue={(i, e) => updateWeights(i, e)} key={i}></Weight>
                )
            })}
        </Grid2>
    );
}
