import useLocation from '~/bridge/ui/useLocation';
import { useAppContext } from '../../app-context/provider';
import { buildLanguageMarketAwareLink, displayableLanguages } from '../../../use-cases/LanguageAndMarket';

export const LanguageSwitcher = () => {
    const { state } = useAppContext();
    const location = useLocation();
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const path = '/' + window.location.pathname.split('/').slice(2).join('/');
        window.location.href = buildLanguageMarketAwareLink(path, event.target.value);
    };
    return (
        <select
            value={state.language}
            onChange={handleChange}
            className="w-[60px] px-2 border-2 hover:cursor-pointer"
            aria-label="Language switcher"
        >
            {displayableLanguages.map((lang) => (
                <option value={lang.code} key={lang.code} disabled={state.language === lang.code}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
};
