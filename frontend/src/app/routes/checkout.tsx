import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { HydratedBasket } from '~/core/components/Bastket';
import { registerAndSendMagickLink } from '~/core/UseCases';
import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '~/core/hooks/useHydrated';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction } from 'remix';


export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger("1m", "1w", ["checkout"]).headers;
}

export default function Checkout() {
    const { isAuthenticated, userInfos } = useAuth();
    return (
        <div>
            <h1>Checkout</h1>
            <div style={{ width: '50%', float: 'left' }}>
                <ClientOnly fallback={<Form />}>{(() => {
                    if (!isAuthenticated) {
                        return <Form />
                    }
                    return <>
                        <p>{userInfos.firstname} {userInfos.lastname}</p>
                        <button onClick={() => {

                        }}>Pay by Cash</button>
                    </>
                })()}</ClientOnly>
            </div>
            <div style={{ width: '50%', float: 'left' }}>
                <HydratedBasket />
            </div>

        </div >
    );
}


export const Form: React.FC = () => {
    const [formData, updateFormData] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim()
        });
    };

    return <>
        <p>You need to register to place you order.</p>
        <p>We'll send you a magick link.</p>
        <form onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await registerAndSendMagickLink(formData);
            alert('We sent you a magick link, check your email.');
        }}>
            <input defaultValue={formData.firstname} type={'firstname'} placeholder={'Firstname'} name='firstname' required onChange={handleChange} /><br />
            <input defaultValue={formData.lastname} type={'lastname'} placeholder={'Lastname'} name='lastname' required onChange={handleChange} /><br />
            <input defaultValue={formData.email} type={'email'} placeholder={'Email'} name='email' required onChange={handleChange} /><br />

            <button type='submit'>Register</button>
        </form>
    </>
}
