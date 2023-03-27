import React from 'react';
import pako from 'pako';

const FileUpload = ({ onData }) => {
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
                onData(parsedJson);
            } catch (error) {
                console.error('Invalid JSON:', error);
            }
        };

        fileReader.readAsArrayBuffer(file);
    };

    return (
        <div className="FileUpload">
            <h1>SPOILERS AWAIT</h1>
            <h2>Upload your save file for top 6 teams according to base dmg, current rank, and expedition dmg/time bonuses:</h2>
            <h3>Written with ChatGPT. Calculations may take a minute. All data stays client-side.</h3>
            <h3>currentRank*baseDmg*groupBonus; rank > 0 to be considered</h3>
            <input type="file" onChange={handleFileUpload} />
        </div>
    );
};

export default FileUpload;
