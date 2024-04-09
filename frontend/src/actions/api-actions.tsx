"use server";

import {cookies} from 'next/headers';
import {setTimeout} from "timers/promises";

const API_SERVER = `${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`

async function getCsrfToken() {
    try {
        const res = await fetch(`http://${API_SERVER}/api/HTTP/get_csrf_token/`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let csrfToken = res.headers.get("X-CSRFToken")
        cookies().set('csrftoken', csrfToken ? csrfToken : '')
    } catch (e) {
        console.log(`Error in getting CSRF Token from /api/HTTP/get_csrf_token : ${String(e)}`)
    }
}

async function sendRequest(formData: FormData) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    const method = formData?.get('method')
    const url = formData?.get('url')
    try {
        const res = await fetch(`http://${API_SERVER}/api/HTTP/`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
            },
            body: JSON.stringify({method: method, url: url})
        })

        // Uncomment to simulate long tasks
        // await setTimeout(10000)
        const json_res = await res.json()
        return json_res
    } catch (e) {
        console.log(`Error in fetching data from /api/HTTP/ : ${String(e)}`)
        return {errors: {error: String(e)}}
    }

}

async function getRequest(id: string) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    try {
        const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
            }
        })
        // Uncomment to simulate long tasks
        // await setTimeout(10000)
        const json_res = await res.json()
        return json_res
    } catch (e) {
        console.log(`Error in fetching data from /api/HTTP/${id} : ${String(e)}`)
        return {errors: {error: String(e)}}
    }
}

async function getTimingData(id: string, sleep: number) {
    const CSRF_TOKEN = cookies().get('csrftoken');
    await setTimeout(sleep*1000)
    try {
        const res = await fetch(`http://${API_SERVER}/api/HTTP/${id}/get_timing_data/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN ? CSRF_TOKEN.value : ''
            }
        })
        // Uncomment to simulate long tasks
        // await setTimeout(10000)
        const json_res = await res.json()
        return json_res
    } catch (e) {
        console.log(`Error in fetching data from /api/HTTP/${id}/get_timing_data : ${String(e)}`)
        return {errors: {error: String(e)}}
    }
}

export {getCsrfToken, sendRequest, getRequest, getTimingData};