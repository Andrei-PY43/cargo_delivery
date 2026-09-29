export const apiFetch = async (path, options = {}) => {
    let accessToken = localStorage.getItem("access_token")
    const respons = await fetch(`http://127.0.0.1:8000${path}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
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
        return respons;
    }
    const refreshData = await refreshRespons.json()
    accessToken = refreshData.access

    localStorage.setItem("access_token", accessToken)

    const new_respons = await fetch(`http://127.0.0.1:8000${path}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    })
    return new_respons
