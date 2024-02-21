import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [isSearching, setIsSearching] = useState(false);

    return (
        <SearchContext.Provider value={{ isSearching, setIsSearching }}>
            {children}
        </SearchContext.Provider>
    );
};