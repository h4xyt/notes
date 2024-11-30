import { search } from 'app/blog/utils';

export default function handler(req, res) {
    const { searchValue } = req.query;
    const result = search(searchValue);
    res.status(200).json({ result });
}