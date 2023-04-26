/**
 *
 */
import React, { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { makeStyles } from '@material-ui/core/styles';
const Decimal = require('decimal.js');
// import './card.css';

const useStyles = makeStyles({
    card: {
        // width: 150,
        // height: 150,
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        position: 'relative'
    },
    positiveChargeResult: {
        textColor: 'green'
    },
    negativeChargeResult: {
        textColor: 'red'
    }
});


const POTATO = 1;
const CLASSEXP = 2;
const SKULL = 3;
const CONFECTIONEXP = 4;
const REINCARNATIONEXP = 5;
const ITEMRATING = 6;
const POOPBONUS = 7;
const MILKBONUS = 8;
const WHACKSCORE = 9;
const BREWINGEXP = 10;
const CALCIUMEXP = 11;
const FERMENTINGEXP = 12;
const RESIDUEBONUS = 13;
const WORMQTY = 14;
const LARVAQTY = 15;
const LARVAEFF = 16;
const ATTACKHP = 17;
const PETDMG = 18;
const PETLEVELEXP = 19;
const PETRANKEXP = 20;
const CARDPOWERB = 21;
const CARDEXPB = 22;
const cardIdMap = {
    [POTATO]: { id: POTATO, label: "Potato", icon: "", },
}

function powerFormula(Pow, logBase, customConstant, isPerm=false) {
    const baseLog = (x, base) => {
        return x.log().div(base.log());
    };
    let result = new Decimal(1.2)
        .pow(
            baseLog(
                new Decimal(Pow),
                new Decimal(logBase)
            ))
        .times(new Decimal(customConstant))
    result = isPerm ? result.times(.5) : result;
    result = result.plus(1);
    return result;

    // return 1.0 + Math.pow(1.2, Math.log(Pow) / Math.log(logBase)) * customConstant;
}
const tempPowerBonusFormula = {
    17 : (Pow) => powerFormula(Pow, 1.5, 0.015),
    1 : (Pow) => powerFormula(Pow, 1.3, 0.018),
    2 : (Pow) => powerFormula(Pow, 1.35, 0.016),
    3 : (Pow) => powerFormula(Pow, 1.325, 0.015),
    5 : (Pow) => powerFormula(Pow, 1.55, 0.001),
    6 : (Pow) => powerFormula(Pow, 1.525, 0.002),
    9 : (Pow) => powerFormula(Pow, 1.325, 0.02),
    7 : (Pow) => powerFormula(Pow, 1.325, 0.016),
    4 : (Pow) => powerFormula(Pow, 1.3, 0.016),
    8 : (Pow) => powerFormula(Pow, 1.35, 0.012),
    10 : (Pow) => powerFormula(Pow, 1.325, 0.011),
    11 : (Pow) => powerFormula(Pow, 1.325, 0.01),
    12 : (Pow) => powerFormula(Pow, 1.4, 0.008),
    13 : (Pow) => powerFormula(Pow, 1.525, 0.002),
    14 : (Pow) => powerFormula(Pow, 1.4, 0.01),
    15 : (Pow) => powerFormula(Pow, 1.3, 0.015),
    16 : (Pow) => powerFormula(Pow, 1.3, 0.02),
    18 : (Pow) => powerFormula(Pow, 1.525, 0.003),
    19 : (Pow) => powerFormula(Pow, 1.5, 0.002),
    20 : (Pow) => powerFormula(Pow, 1.55, 0.001),
    _ : (Pow) => 1.0
};
const permPowerBonusFormula = {
    17 : (Pow) => powerFormula(Pow, 1.5, 0.015, true),
    1 : (Pow) => powerFormula(Pow, 1.3, 0.018, true),
    2 : (Pow) => powerFormula(Pow, 1.35, 0.016, true),
    3 : (Pow) => powerFormula(Pow, 1.325, 0.015, true),
    5 : (Pow) => powerFormula(Pow, 1.55, 0.001, true),
    6 : (Pow) => powerFormula(Pow, 1.525, 0.002, true),
    9 : (Pow) => powerFormula(Pow, 1.325, 0.02, true),
    7 : (Pow) => powerFormula(Pow, 1.325, 0.016, true),
    4 : (Pow) => powerFormula(Pow, 1.3, 0.016, true),
    8 : (Pow) => powerFormula(Pow, 1.35, 0.012, true),
    10 : (Pow) => powerFormula(Pow, 1.325, 0.011, true),
    11 : (Pow) => powerFormula(Pow, 1.325, 0.01, true),
    12 : (Pow) => powerFormula(Pow, 1.4, 0.008, true),
    13 : (Pow) => powerFormula(Pow, 1.525, 0.002, true),
    14 : (Pow) => powerFormula(Pow, 1.4, 0.01, true),
    15 : (Pow) => powerFormula(Pow, 1.3, 0.015, true),
    16 : (Pow) => powerFormula(Pow, 1.3, 0.02, true),
    18 : (Pow) => powerFormula(Pow, 1.525, 0.003, true),
    19 : (Pow) => powerFormula(Pow, 1.5, 0.002, true),
    20 : (Pow) => powerFormula(Pow, 1.55, 0.001, true),
    _ : (Pow) => new Decimal(1.0)
};

const CARD_DISPLAY_IDS = [
    17,1,2,3,9,
    7,4,14,15,16,
    8,10,11,12,13,
    5,6,19,18,20
]
export default function CardComponent({ data }) {
    const classes = useStyles();
    if (!!data === false) return <div></div>;
    const {
        CardsCollection, CardExpBonuses, CardPowerBonuses, ChargeTransfertPowerPerma, ChargeTransfertPowerTemp,
        ExpeShopChargeTransfertPowerLevel, CowShopChargeTransfertPower, WAPChargeTransfertPower
    } = data;
    const transferPower = 0.025 + 0.0025 * ExpeShopChargeTransfertPowerLevel + 0.0025 * CowShopChargeTransfertPower + 0.0025 * WAPChargeTransfertPower;

    // const foundCards = CardsCollection.filter(card => card.Found === 1);
    const cardsById = CardsCollection.reduce((accum, card) => {
        accum[card.ID] = card;
        return accum;
    }, {});
    const cardInfo = CARD_DISPLAY_IDS.map(id => cardsById[id] || false).filter(i => !!i).map((card, i) => {
        const {
            CurrentExp,
            ExpNeeded,
            Found,
            ID,
            Level,
            PowerPerma,
            PowerTemp
        } = card;

        const permValue = permPowerBonusFormula[ID](PowerPerma);
        const tempValue = tempPowerBonusFormula[ID](PowerTemp);
        const lvlValue = new Decimal(0.02).times(new Decimal(Level)).plus(1);
        const tempTimesPerm = (permValue.times(tempValue)).minus(1);
        const total = tempTimesPerm.times(lvlValue);

        const afterCharge = new Decimal((
            tempPowerBonusFormula[ID](PowerTemp * (1.0 - ChargeTransfertPowerTemp))
            * permPowerBonusFormula[ID](PowerPerma + PowerTemp * ChargeTransfertPowerPerma) - 1.0
        ) * (1.0 + Level * 0.02));
        const isPositiveChargeRatio = afterCharge.gt(total);

        // const displayPerm = ((permValue.minus(new Decimal(1.))).times(new Decimal(100.))).toFixed(4);
        // const displayTemp = ((tempValue.minus(new Decimal(1.))).times(new Decimal(100.))).toFixed(2);
        // const displayLvlMod = ((lvlValue.minus(new Decimal(1.))).times(new Decimal(100.))).toFixed(2);

        // TODO tooltip the scalars
        return (
            <Grid2 xs={1} key={i}>
                <Box sx={{ minWidth: 20 }}>
                    <Card variant="outlined" className={classes.card}>
                        <img src={`/fapi/cards/card${ID}.png`} />
                        {/*<Typography variant="body1" gutterBottom>{total.toExponential(4)}</Typography>*/}
                        {/*<Typography variant="body1" gutterBottom>->{afterCharge.toExponential(4)}</Typography>*/}
                        <Typography sx={{color: isPositiveChargeRatio ? 'green' : 'red'}} variant="body1" gutterBottom>
                            {isPositiveChargeRatio ? '+' : ''}&nbsp;{total.isZero() ? '0/0' : afterCharge.div(total).sub(1).times(100).toFixed(2)}%
                        </Typography>
                    </Card>
                </Box>
            </Grid2>
        );
    })

    return (
        <Grid2 container spacing={.5}>
            <Grid2 xs={12}>
                <Typography variant={"h4"}>{data?.CurrentCardCharge}&nbsp;<img src={`/fapi/cards/charge.png`} /></Typography>
            </Grid2>
            {cardInfo.map(cardElement => cardElement)
                .reduce((accum, cardElement, i) => {
                    accum.push(cardElement);
                    // pad grid's 6-wide column with blanks
                    if ((i + 1) % 5 === 0) accum.push(
                        (<Grid2 xs={7} key={`${i}-buffer`}>
                            <div>&nbsp;</div>
                        </Grid2>
                    ));
                    return accum;
                }, [])}
        </Grid2>
    );
}
