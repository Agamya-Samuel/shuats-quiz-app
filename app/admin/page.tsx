import AdminPageClient from './_components/AdminPageClient';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <AdminPageClient searchParams={searchParams} />;
}
