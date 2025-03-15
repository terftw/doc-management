import ContentLayout from '@/components/layouts/content-layout';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContentLayout>{children}</ContentLayout>;
};

export default HomeLayout;
