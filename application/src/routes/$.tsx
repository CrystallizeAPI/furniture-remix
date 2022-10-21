import { LoaderFunction, redirect } from '@remix-run/node';
import { availableLanguages } from '~/core/LanguageAndMarket';
export const loader: LoaderFunction = async () => {
    return redirect('/' + availableLanguages[0], 301);
};
