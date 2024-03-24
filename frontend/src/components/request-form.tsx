export default function RequestForm({formAction, url, method}) {

    return (
        <form className="flex bg-neutral-200 rounded-md order-1 md:order-2" action={formAction}>
            <select id="method" name="method" className="m-2 px-0 md:px-2 py-1 rounded-md border-0 text-gray-600
                    bg-neutral-50 hover:bg-white shadow-sm appearance-none text-center"
                    defaultValue={method} disabled={method}>
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>INFO</option>
                <option>DUMB</option>
            </select>
            <input className="placeholder:italic placeholder:text-slate-400 m-2 bg-neutral-200 rounded-md px-2 py-1
                   focus:outline-none focus:bg-neutral-100 w-full" defaultValue={url} disabled={url}
                   placeholder="Type your URL ..." type="text" name="url"/>
            { formAction &&
            <button type="submit" className="m-2 px-1 md:px-6 py-1 rounded-md bg-blue-500 text-gray-100 shadow-sm
                hover:bg-blue-600 focus-visible:outline">
                <span className="hidden md:block">SEND</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                     className="w-6 h-6 md:hidden">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59
                          5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"/>
                </svg>
            </button>
            }
        </form>
    );

}
