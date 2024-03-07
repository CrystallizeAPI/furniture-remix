import { LoaderFunction, redirect } from '@remix-run/node';
import { availableLanguages } from '~/use-cases/LanguageAndMarket';
export const loader: LoaderFunction = async () => {
    return redirect('/' + availableLanguages[0], 301);
};
