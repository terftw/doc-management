import ContentLayout from '@/components/layouts/content-layout';
import React from 'react';

const FoldersLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContentLayout>{children}</ContentLayout>;
};

export default FoldersLayout;
