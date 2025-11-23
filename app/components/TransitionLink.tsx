'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    href: string;
}

export default function TransitionLink({
    children,
    href,
    ...props
}: TransitionLinkProps) {
    const router = useRouter();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        if (!document.startViewTransition) {
            router.push(href);
            return;
        }

        document.documentElement.classList.add('navigating');

        const transition = document.startViewTransition(() => {
            router.push(href);
        });

        try {
            await transition.finished;
        } finally {
            document.documentElement.classList.remove('navigating');
        }
    };

    return (
        <Link href={href} {...props} onClick={handleTransition}>
            {children}
        </Link>
    );
}
