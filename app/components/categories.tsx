import Link from 'next/link';
import { getCategories } from 'app/blog/utils';

export function Categories() {
  let allCategories = getCategories();

  return (
    <div>
      {allCategories
        .sort()
        .map((categorie) => (
          <Link
            key={categorie.metadata.group}
            className="flex flex-col space-y-1 mb-4"
            href={`/categories/${categorie.metadata.group}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {categorie.metadata.group}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};
