import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import { NewUserModal } from "./new-user-modal";
import { DataTable } from "./user-data-table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table-skeleton";

const usersList = async () => {
  const allUsers = await prisma.user.findMany({
    include: {
      uploadedMedia: true,
      createdBatches: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <SiteHeader title="Users" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <div className="mx-6 mb-4">
                <NewUserModal />
              </div>
              <Suspense fallback={<TableSkeleton />}>
                <DataTable data={allUsers} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default usersList;
