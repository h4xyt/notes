export function SearchBar({searchValue, setSearchValue, handleSearch}:
    {searchValue: string, setSearchValue: Function, handleSearch: Function}) {
    console.log(searchValue)
    return (
        <div className="flex w-full bg-black border border-white rounded overflow-hidden">
            <input
                type="text"
                placeholder="Escribe aquí..."
                value={searchValue}
                onChange={(ev) => setSearchValue(ev.target.value)}
                onKeyDown={(ev) => ev.code === 'Enter' && handleSearch()}
                className="flex-1 bg-black text-white outline-none px-4 py-2"
            />
            <button className="bg-white text-black px-4 py-2" onClick={() => handleSearch()}>Buscar</button>
        </div>
    );
}