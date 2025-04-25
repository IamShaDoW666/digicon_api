import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import { UserDataTable } from "./data-table";

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
            <UserDataTable data={allUsers} />
          </div>
        </div>
      </div>
    </>
  );
};

export default usersList;
