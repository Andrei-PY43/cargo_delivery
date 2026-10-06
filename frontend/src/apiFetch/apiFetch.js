export const apiFetch = async (path, options = {}) => {
    let accessToken = localStorage.getItem("access_token")

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }

    const respons = await fetch(`http://127.0.0.1:8000${path}`, {
        ...options,
        headers: headers,
    })

    if (respons.status !== 401) {
        return respons
    }


    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
        return respons
    }
    const refreshRespons = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refreshToken
        })
    })


    if (!refreshRespons.ok) {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    return respons
}
    const refreshData = await refreshRespons.json()
    accessToken = refreshData.access

    localStorage.setItem("access_token", accessToken)

const newHeaders = {
    ...options.headers,
    "Authorization": `Bearer ${accessToken}`,
}

if (!(options.body instanceof FormData)) {
    newHeaders["Content-Type"] = "application/json"
}

const newRespons = await fetch(`http://127.0.0.1:8000${path}`, {
    ...options,
    headers: newHeaders,
})
    return newRespons
}