import { Categories } from 'app/components/categories';

export const metadata = {
  title: 'Categorías',
  description: 'Selecciona una categoría',
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Categorías</h1>
      <Categories />
    </section>
  );
};
