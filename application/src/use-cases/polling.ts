export const pollingUntil = async (
    condition: (iteration: number) => Promise<boolean>,
    timeout: number = 3600000,
    increment: number = 2000,
) => {
    let interval = increment;
    let iteration = 0;

    // first time we wait 2x the increment
    if (iteration === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2 * increment));
    }

    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await condition(iteration++)) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
};
