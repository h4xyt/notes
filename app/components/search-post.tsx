import Link from 'next/link';

export function SearchPost({ post }) {

    return (
        <div className='container'>
            <div className="title-container bg-gray-100 pl-2 pr-4 h-10 list-none rounded-tl-md rounded-tr-md border border-gray-300 flex items-center">
                <div className="title flex flex-[1_1_0%] items-center ml-1 min-w-0">
                    <Link
                        key={ post.slug }
                        className="flex flex-col font-black underline space-y-1 text-black"
                        href={ `/blog/${post.slug}` }
                    >
                        { post.metadata.title }
                    </Link>
                </div>
            </div>
            <div className="content-container border-t border-gray-300 rounded-bl-none rounded-br-none">
                <div className="whitespace-pre-wrap font-mono min-w-0 cursor-pointer pb-6">
                    <table role="table" className="border-collapse mt-0 max-w-full w-full table-fixed">
                        <tbody role="rowgroup">
                            {
                                post.content.map((line) => {
                                    const coincidence = line.content.match(/<mark>.*<\/mark>/);

                                    let formatted: string[];

                                    if (coincidence) {
                                        formatted = line.content.split(coincidence[0]);
                                    } else {
                                        formatted = [line.content];
                                    }
                                    return (
                                        <tr role="row flex">
                                            <td className="relative w-[60px] p-0 font-mono text-xs leading-5 text-white text-right whitespace-nowrap align-top cursor-pointer select-none">
                                                { line.lineNumber }
                                            </td>
                                            <td className="table-cell overflow-visible font-mono text-xs text-white break-words whitespace-pre-wrap relative px-2.5 leading-5 align-top"
                                            >
                                                { formatted.map((text: string, i: number) => (
                                                    <>
                                                        { text }
                                                        { +i !== formatted.length - 1 && (
                                                            <span dangerouslySetInnerHTML={ { __html: coincidence } }></span>
                                                        ) }
                                                    </>
                                                )) }
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}