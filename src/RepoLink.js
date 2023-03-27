import React from 'react';
import './RepoLink.css';

const RepoLink = () => {
    return (
        <a
            href="https://github.com/trigunshin/fapi"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-link"
        >
            View on GitHub
        </a>
    );
};

export default RepoLink;
