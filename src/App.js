import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import JSONDisplay from './JSONDisplay';
import RepoLink from './RepoLink';
import CardComponent from './cards/card';
import { petNameArray } from './itemMapping';
import ItemSelection from './ItemSelection';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import { Container, Box } from '@mui/material';

const Home = () => <div>Home</div>;
const Info = () => <div>Info</div>;

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5'
        }
    },
    typography: {
        fontFamily: 'Roboto',
    },
});

const defaultPetSelection = petNameArray.map(petData => petData.petId);

function App() {
    const [data, setData] = useState(null);
    const [defaultRank, setDefaultRank] = useState(0);
    const [includeLocked, setIncludeLocked] = useState(false);
    const [selectedItems, setSelectedItems] = useState(defaultPetSelection);
    const [tabSwitch, setTabSwitch] = useState(0);

    const selectComponent = () => {
        switch (tabSwitch) {
            case 2:
                return <CardComponent data={data} />;
            case 1:
                return <JSONDisplay data={data} selectedItems={selectedItems} defaultRank={defaultRank} onItemSelected={handleItemSelected} />;
            case 0:
                return <FileUpload onData={handleData} />;
            default:
                return <FileUpload onData={handleData} />;
        }
    };

    const handleData = (uploadedData) => {
        setData(uploadedData);
        console.log(uploadedData)
        const positiveRankedPets = uploadedData.PetsCollection.filter(
            (pet) => {
                const isValidRank = defaultRank ? true : !!pet.Rank;
                const isValidLocked = includeLocked ? true : !!pet.Locked;
                return isValidRank && isValidLocked;
            }
        ).map((pet) => pet.ID);
        setSelectedItems(positiveRankedPets);
        if (tabSwitch === 0) setTabSwitch(1);  // move upload to expedition when done
    };

    const handleItemSelected = (items) => {
        setSelectedItems(items);
    };

    return (
        <ThemeProvider theme={theme}>
            <RepoLink />
            <Container>
                <Box sx={{ flexGrow: 1 }}>
                    {selectComponent()}
                </Box>
                <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
                    <BottomNavigation
                        showLabels
                        value={tabSwitch}
                        onChange={(event, newValue) => setTabSwitch(newValue)}
                    >
                        <BottomNavigationAction label="Upload" icon={<InfoIcon />} />
                        {!!data && <BottomNavigationAction label="Expedition" icon={<InfoIcon />} />}
                        {!!data && <BottomNavigationAction label="Cards" icon={<BadgeIcon />} />}
                    </BottomNavigation>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
