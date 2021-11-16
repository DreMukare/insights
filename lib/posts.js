import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// stores path to posts in postsDirectory
// path.join normalizes path returned by process.cwd() with posts
// this results in a path to the posts directory from the current working directory
const postsDirectory = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
	// get the names of the files under /posts
	// fs.readdirSync reads the contents of a directory synchronously and stores them in an array
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map((fileName) => {
		// removing .md extension from file name to get id
		const id = fileName.replace(/\.md$/, '');

		// Reading markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf8');

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...matterResult.data,
		};
	});
	// Sort posts by date
	return allPostsData.sort(({ date: a }, { date: b }) => {
		if (a < b) {
			return 1;
		} else if (a > b) {
			return -1;
		} else {
			return 0;
		}
	});
};

export const getAllPostIds = () => {
	const fileNames = fs.readdirSync(postsDirectory);
	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       id: 'pre-rendering'
	//     }
	//   }
	// ]

	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ''),
			},
		};
	});
};

export const getPostData = async (id) => {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');

	// parsing the posts metadata section
	const matterResult = matter(fileContents);

	// using remark to convert markdown into HTML string
	const processedContent = await remark()
		.use(html)
		.process(matterResult.content);
	const contentHTML = processedContent.toString();

	return {
		id,
		contentHTML,
		...matterResult.data,
	};
};
