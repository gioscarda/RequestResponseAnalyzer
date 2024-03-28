"use server";

import {cookies} from 'next/headers';
// import {setTimeout} from "timers/promises";

const API_SERVER = `${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`

async function sendRequest(formData: FormData) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    const method = formData?.get('method')
    const url = formData?.get('url')
    const res = await fetch(`http://${API_SERVER}/api/HTTP/`, {
        cache: 'no-store',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
        },
        body: JSON.stringify({method: method, url: url})
    })
    // Uncomment to simulate long tasks
    // await setTimeout(10000)
    return res.json()
}

async function getRequest(id: string) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
        }
    })
    // Uncomment to simulate long tasks
    // await setTimeout(10000)
    return res.json()
}

async function getTimingData(id: string) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/get_timing_data/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
        }
    })
    // Uncomment to simulate long tasks
    // await setTimeout(10000)
    return res.json()
}

export {sendRequest, getRequest, getTimingData};