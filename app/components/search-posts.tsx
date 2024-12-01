import { SearchPost } from './search-post';

export function SearchPosts({posts}) {
    return (
        <div className="mt-10">
            {posts.map((post) => <SearchPost post={post}/>)}
        </div>
    )
}