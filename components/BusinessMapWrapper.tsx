'use client';

import dynamic from 'next/dynamic';
import { IBusiness } from '@/types';

const BusinessMap = dynamic(() => import('./BusinessMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
});

interface BusinessMapWrapperProps {
  businesses: IBusiness[];
}

export default function BusinessMapWrapper(props: BusinessMapWrapperProps) {
  return <BusinessMap {...props} />;
}
