"use server";

import { cookies } from 'next/headers';
import { setTimeout } from "timers/promises";

const API_SERVER = `${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`

async function sendRequest(formData: FormData) {

    const method = formData?.get('method')
    const url = formData?.get('url')
    const res = await fetch(`http://${API_SERVER}/api/HTTP/`, {
        cache: 'no-store',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({method: method, url: url, status: null})
    })
    await setTimeout(10000);
    console.log("WAITING ...")
    return res.json()
}

async function getRequest(id: string) {
    const csrftoken = cookies().get('csrftoken');
    const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    await setTimeout(10000);
    console.log("WAITING ...")
    return res.json()
}

async function getTimingData(id: string) {
    const csrftoken = cookies().get('csrftoken');
    const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/get_timing_data/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    return res.json()
}

export { sendRequest, getRequest, getTimingData };