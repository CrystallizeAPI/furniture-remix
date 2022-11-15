import { Link } from '@remix-run/react';

export default (props: any & { children: React.ReactNode }) => {
    return <Link {...props}>{props.children}</Link>;
};
