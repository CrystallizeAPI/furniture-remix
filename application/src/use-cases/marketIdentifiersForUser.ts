export const marketIdentifiersForUser = (user: any) => {
    if (!user?.email) return [''];
    const emailDomain = user?.email?.split('@')[1] || null;

    return emailDomain === 'crystallize.com' ? ['europe-b2c'] : [''];
};
