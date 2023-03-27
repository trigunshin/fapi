import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import JSONDisplay from './JSONDisplay';
import RepoLink from './RepoLink';

function App() {
    const [data, setData] = useState(null);

    const handleData = (uploadedData) => {
        setData(uploadedData);
    };

    return (
        <div className="App">
            <RepoLink />
            <FileUpload onData={handleData} />
            {data && (
                <JSONDisplay data={data} />
            )}
        </div>
    );
}

export default App;
