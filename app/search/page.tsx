import { search } from 'app/blog/utils';
import { Search } from 'app/components/search';

export const metadata = {
    title: 'Search',
    description: 'Busca',
};

export default function Page() {
    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Buscar</h1>
            <Search/>
        </section>
    );
};