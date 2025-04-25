import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
const adminHome = async () => {
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
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards batches={allBatches} />
            <div className="px-4 lg:px-6">
              {/* <ChartAreaInteractive batches={allBatches} /> */}
            </div>
            {/* <DataTable data={data} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default adminHome;
