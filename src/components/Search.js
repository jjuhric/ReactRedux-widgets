// https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Search = () => {
    const [term, setTerm] = useState('programming');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(term);
        }, 1000);

        return () => {clearTimeout(timerId)};
    }, [term]);

    useEffect(() => {
        const search = async () => {
            const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    list: 'search',
                    origin: '*',
                    format: 'json',
                    srsearch: debouncedTerm
                }
            });

            setResults(data.query.search);
        };

        search();

    }, [debouncedTerm, results.length]);

    const renderedResults = results.map(({ title, snippet, pageid }) => {
        return (
            <div key={pageid} className="item">
                <div className="right floated element">
                    <a href={`https://en.wikipedia.org?curid=${pageid}`} className="ui button">Go</a>
                </div>
                <div className="content">
                    <div className="header">
                        {title}
                    </div>
                    <span dangerouslySetInnerHTML={{ __html: snippet }}></span>
                </div>
            </div>
        );
    });

    return (
        <div>
            <div className="ui form">
                <div className="field">
                    <label>Search Term</label>
                    <input
                        value={term} className="input"
                        onChange={({ target }) => setTerm(target.value)}
                    />
                </div>
            </div>
            <div className="ui celled list">
                {renderedResults}
            </div>
        </div>
    )
};

export default Search;