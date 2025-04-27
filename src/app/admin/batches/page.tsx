import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import { BatchDataTable } from "./data-table";
const batchesList = async () => {
  const allBatches = await prisma.batch.findMany({
    include: {
      media: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
 
      <SiteHeader title="Batches" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            <BatchDataTable data={allBatches} />
          </div>
        </div>
      </div>
    </>
   );
 };

export default batchesList;
