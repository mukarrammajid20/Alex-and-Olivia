import { getAdminSession } from "@/lib/session";
import { getWeddingData } from "@/lib/storage/wedding-store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return <AdminLogin />;
  }

  const data = await getWeddingData();

  return <AdminDashboard initialData={data} />;
};

export default AdminPage;
