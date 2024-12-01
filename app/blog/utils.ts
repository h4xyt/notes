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

function mapSearchContent(search: string, text: string): { lineNumber: number; content: string; }[] {
  const lines = text.split("\n");
  const results: { lineNumber: number; content: string; }[] = [];
  const matches: number[] = [];

  lines.forEach((line, index) => {
    if (line.match(new RegExp(search, 'i'))) {
      matches.push(index);
    }
  });

  if (matches.length === 0) {
    for (let i = 0; i < Math.min(7, lines.length); i++) {
      results.push({ lineNumber: i + 1, content: lines[i] });
    }
  } else if (matches.length === 1) {
    const matchIndex = matches[0];
    const start = Math.max(0, matchIndex - 1);
    const end = Math.min(lines.length, matchIndex + 6);

    for (let i = start; i < end; i++) {
      results.push({
        lineNumber: i + 1,
        content: i === matchIndex ? lines[i].replace(new RegExp('(?:' + search + ')', 'i'), `<mark>$&</mark>`) : lines[i],
      });
    }
  } else {
    const firstMatch = matches[0];
    const secondMatch = matches[1];
    const start = Math.max(0, firstMatch - 1);
    const afterFirstMatch = Math.min(lines.length, firstMatch + 5);

    for (let i = start; i < afterFirstMatch; i++) {
      results.push({
        lineNumber: i + 1,
        content: i === firstMatch ? lines[i].replace(search, `<mark>${search}</mark>`) : lines[i],
      });
    }

    results.push({
      lineNumber: secondMatch + 1,
      content: lines[secondMatch].replace(search, `<mark>${search}</mark>`),
    });
  }

  return results;
}

export function search(query: string) {
  const lowerCaseQuery = query.toLowerCase();
  if (!query || typeof query !== "string") return [];

  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts')).filter((post) => {
    const { content, metadata: { title, summary } = {} } = post;

    const fields = [content, title, summary].map((field) => field?.toLowerCase() || "");

    return fields.some(field => field.includes(lowerCaseQuery));
  })
    .map((post) => ({
      ...post,
      content: mapSearchContent(query, post.content)
    }));
};
