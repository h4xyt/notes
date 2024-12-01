'use client';

import { useState } from 'react';
import { SearchBar } from './search-bar';
import { Metadata } from 'app/blog/utils';
import { SearchPosts } from './search-posts';

export function Search() {
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredPosts, setFilteredPosts] = useState<{ metadata: Metadata; slug: string; content: string; }[]>([]);
    const handleSearch = async () => {
        const results = await fetch('/api/search/get-search-results?query=' + searchValue);
        const json = await results.json();
        setFilteredPosts(json.result);
    };

    return (
        <>
            <SearchBar
                searchValue={ searchValue }
                setSearchValue={ setSearchValue }
                handleSearch={ handleSearch } />

            {!!filteredPosts.length && <SearchPosts posts={filteredPosts}/>}
        </>
    );
}