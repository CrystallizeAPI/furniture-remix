export default async (keys: string[]) => {
    const response = await fetch(`https://api.fastly.com/service/${process.env.FASTLY_SERVICE_ID}/purge`, {
        method: 'POST',
        headers: {
            'fastly-soft-purge': `1`,
            'Fastly-Key': `${process.env.FASTLY_API_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'surrogate-key': keys.join(' '),
        },
    });
    return await response.json();
};
