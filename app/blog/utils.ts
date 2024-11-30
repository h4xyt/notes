import fs from 'fs';
import path from 'path';

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  group?: string;
  groupOrder?: number;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key.trim() || '' as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return typeof rawContent === 'string' ? parseFrontmatter(rawContent) : rawContent;
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'));
};

export function getCategories() {
  return [...new Set(getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
    .map((category) => ({
      ...category,
      metadata: {
        ...category.metadata,
        group: category.metadata.group || ''
      }
    }))
  )].filter((category, i, arr) => arr.findIndex((c) => c.metadata.group === category.metadata.group) === i);
};

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `hace ${yearsAgo} año${yearsAgo !== 1 ? 's' : ''}`;
  } else if (monthsAgo > 0) {
    formattedDate = `hace ${monthsAgo} mes${monthsAgo !== 1 ? 'es' : ''}`;
  } else if (daysAgo > 0) {
    formattedDate = `hace ${daysAgo} día${daysAgo !== 1 ? 's' : ''}`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('es', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
};

export function search(query: string) {
  const lowerCaseQuery = query.toLowerCase();
  if (!query || typeof query !== "string") return [];

  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts')).filter((post) => {
    const { content, metadata: { title, summary } = {} } = post;

    const fields = [content, title, summary].map((field) => field?.toLowerCase() || "");
    
    return fields.some(field => field.includes(lowerCaseQuery));
  });
};
