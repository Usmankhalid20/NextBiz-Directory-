'use client';

import dynamic from 'next/dynamic';

const BusinessMap = dynamic(() => import('./BusinessMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
});

export default function BusinessMapWrapper(props) {
  return <BusinessMap {...props} />;
}
