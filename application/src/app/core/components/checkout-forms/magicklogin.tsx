import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuth } from '~/core/hooks/useAuth';
import { ServiceAPI } from '~/use-cases/service-api';
import { Input } from '../input';

export const MagickLoginForm: React.FC<{
    enabledGuest?: Function;
    title: string;
    actionTitle: string;
    onlyLogin?: boolean;
}> = ({ enabledGuest, title, actionTitle, onlyLogin = false }) => {
    const { isAuthenticated, userInfos, logout } = useAuth();
    const [formData, updateFormData] = useState({
        firstname: userInfos?.firstname || '',
        lastname: userInfos?.lastname || '',
        email: userInfos?.email || '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim(),
        });
    };
    const displayOnlyLogin = onlyLogin || isAuthenticated;

    return (
        <div className="flex flex-col mt-5 gap-2 w-full sm:min-w-[400px]">
            {userInfos?.email && (
                <div>
                    <div className="bg-grey2 px-4 py-2 rounded">
                        <button
                            className="float-right bg-[#000] text-[#fff] px-4 py-2 rounded mt-2"
                            onClick={() => logout()}
                        >
                            Logout
                        </button>
                        <p className="clear">
                            <em>
                                Hello {userInfos?.firstname} {userInfos?.lastname} ({userInfos?.email})
                            </em>
                            <br />
                            Is that still you? You lost the session, you have to login again.
                        </p>
                    </div>
                </div>
            )}
            <h1 className="font-bold text-2xl">{title.replace('Register', isAuthenticated ? 'Login' : 'Register')}</h1>
            <p className="mb-5  text-lg">We'll send you a magick link.</p>
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (onlyLogin) {
                        await ServiceAPI.sendMagickLink(formData.email, '/orders');
                    } else {
                        await ServiceAPI.registerAndSendMagickLink(formData);
                    }
                    alert('We sent you a magick link, check your email.');
                }}
            >
                {!displayOnlyLogin && (
                    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
                        <Input
                            defaultValue={formData.firstname || userInfos?.firstname}
                            label="First name"
                            placeholder="Luke"
                            name="firstname"
                            required
                            onChange={handleChange}
                        />

                        <Input
                            defaultValue={formData.lastname || userInfos?.lastname}
                            placeholder="Skywalker"
                            label="Last name"
                            name="lastname"
                            required
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div className="mt-2">
                    <Input
                        defaultValue={formData.email || userInfos?.email}
                        placeholder="luke.skywalker@rebellion.inc"
                        label="Email"
                        name="email"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-start">
                    {enabledGuest && (
                        <button
                            type="button"
                            className="underline px-5 py-2 ml-2 rounded mt-5 w-full"
                            onClick={() => {
                                if (enabledGuest) {
                                    enabledGuest();
                                }
                            }}
                        >
                            Guest Checkout
                        </button>
                    )}
                    <button type="submit" className="bg-[#000] text-[#fff] px-8 py-4 rounded mt-5 w-full">
                        {actionTitle.replace('Register', isAuthenticated ? 'Login' : 'Register')}
                    </button>
                </div>
            </form>
        </div>
    );
};
