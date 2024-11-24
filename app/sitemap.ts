import { getBlogPosts, getCategories } from 'app/blog/utils';

export const baseUrl = 'http://localhost:3000';

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let categories = getCategories().map((categorie) => ({
    url: `${baseUrl}/categories/${categorie.slug}`
  }));

  let routes = ['', '/blog', '/categories'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs, ...categories];
};
