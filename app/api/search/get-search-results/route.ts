import { NextResponse } from 'next/server';
import { search } from 'app/blog/utils';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const searchValue = searchParams.get('query');

    if (!searchValue) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const result = search(searchValue);
    return NextResponse.json({ result });
}
