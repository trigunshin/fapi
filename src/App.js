import React, { useState } from 'react';
import pako from 'pako';
import JSONDisplay from './JSONDisplay';

function App() {
    const [jsonData, setJsonData] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
            const compressedData = new Uint8Array(event.target.result);
            const decompressedData = pako.inflate(compressedData);
            const textDecoder = new TextDecoder('utf-8');
            const decodedString = textDecoder.decode(decompressedData);

            const startPosition = decodedString.indexOf('{');
            const endPosition = decodedString.lastIndexOf('}') + 1;
            const jsonString = decodedString.slice(startPosition, endPosition);

            try {
                const parsedJson = JSON.parse(jsonString);
                setJsonData(parsedJson);
            } catch (error) {
                console.error('Invalid JSON:', error);
            }
        };

        fileReader.readAsArrayBuffer(file);
    };
    if (jsonData) {
        console.log(jsonData.petsCollection);
        return <JSONDisplay data={jsonData} />;
    }

    return (
        <div className="App">
            <input type="file" onChange={handleFileUpload} />
        </div>
    );
}

export default App;
