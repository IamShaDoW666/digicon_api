"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Prisma } from "@prisma/client";

export const description = "An interactive area chart";
type BatchWithMediaAndCreatedBy = Prisma.BatchGetPayload<{
  include: {
    media: true;
    createdBy: true;
  };
}>;
const chartData = [
  { date: "2024-04-01", desktop: 222, batch: 150 },
  { date: "2024-04-02", desktop: 97, batch: 180 },
  { date: "2024-04-03", desktop: 167, batch: 120 },
  { date: "2024-04-04", desktop: 242, batch: 260 },
  { date: "2024-04-05", desktop: 373, batch: 290 },
  { date: "2024-04-06", desktop: 301, batch: 340 },
  { date: "2024-04-07", desktop: 245, batch: 180 },
  { date: "2024-04-08", desktop: 409, batch: 320 },
  { date: "2024-04-09", desktop: 59, batch: 110 },
  { date: "2024-04-10", desktop: 261, batch: 190 },
  { date: "2024-04-11", desktop: 327, batch: 350 },
  { date: "2024-04-12", desktop: 292, batch: 210 },
  { date: "2024-04-13", desktop: 342, batch: 380 },
  { date: "2024-04-14", desktop: 137, batch: 220 },
  { date: "2024-04-15", desktop: 120, batch: 170 },
  { date: "2024-04-16", desktop: 138, batch: 190 },
  { date: "2024-04-17", desktop: 446, batch: 360 },
  { date: "2024-04-18", desktop: 364, batch: 410 },
  { date: "2024-04-19", desktop: 243, batch: 180 },
  { date: "2024-04-20", desktop: 89, batch: 150 },
  { date: "2024-04-21", desktop: 137, batch: 200 },
  { date: "2024-04-22", desktop: 224, batch: 170 },
  { date: "2024-04-23", desktop: 138, batch: 230 },
  { date: "2024-04-24", desktop: 387, batch: 290 },
  { date: "2024-04-25", desktop: 215, batch: 250 },
  { date: "2024-04-26", desktop: 75, batch: 130 },
  { date: "2024-04-27", desktop: 383, batch: 420 },
  { date: "2024-04-28", desktop: 122, batch: 180 },
  { date: "2024-04-29", desktop: 315, batch: 240 },
  { date: "2024-04-30", desktop: 454, batch: 380 },
  { date: "2024-05-01", desktop: 165, batch: 220 },
  { date: "2024-05-02", desktop: 293, batch: 310 },
  { date: "2024-05-03", desktop: 247, batch: 190 },
  { date: "2024-05-04", desktop: 385, batch: 420 },
  { date: "2024-05-05", desktop: 481, batch: 390 },
  { date: "2024-05-06", desktop: 498, batch: 520 },
  { date: "2024-05-07", desktop: 388, batch: 300 },
  { date: "2024-05-08", desktop: 149, batch: 210 },
  { date: "2024-05-09", desktop: 227, batch: 180 },
  { date: "2024-05-10", desktop: 293, batch: 330 },
  { date: "2024-05-11", desktop: 335, batch: 270 },
  { date: "2024-05-12", desktop: 197, batch: 240 },
  { date: "2024-05-13", desktop: 197, batch: 160 },
  { date: "2024-05-14", desktop: 448, batch: 490 },
  { date: "2024-05-15", desktop: 473, batch: 380 },
  { date: "2024-05-16", desktop: 338, batch: 400 },
  { date: "2024-05-17", desktop: 499, batch: 420 },
  { date: "2024-05-18", desktop: 315, batch: 350 },
  { date: "2024-05-19", desktop: 235, batch: 180 },
  { date: "2024-05-20", desktop: 177, batch: 230 },
  { date: "2024-05-21", desktop: 82, batch: 140 },
  { date: "2024-05-22", desktop: 81, batch: 120 },
  { date: "2024-05-23", desktop: 252, batch: 290 },
  { date: "2024-05-24", desktop: 294, batch: 220 },
  { date: "2024-05-25", desktop: 201, batch: 250 },
  { date: "2024-05-26", desktop: 213, batch: 170 },
  { date: "2024-05-27", desktop: 420, batch: 460 },
  { date: "2024-05-28", desktop: 233, batch: 190 },
  { date: "2024-05-29", desktop: 78, batch: 130 },
  { date: "2024-05-30", desktop: 340, batch: 280 },
  { date: "2024-05-31", desktop: 178, batch: 230 },
  { date: "2024-06-01", desktop: 178, batch: 200 },
  { date: "2024-06-02", desktop: 470, batch: 410 },
  { date: "2024-06-03", desktop: 103, batch: 160 },
  { date: "2024-06-04", desktop: 439, batch: 380 },
  { date: "2024-06-05", desktop: 88, batch: 140 },
  { date: "2024-06-06", desktop: 294, batch: 250 },
  { date: "2024-06-07", desktop: 323, batch: 370 },
  { date: "2024-06-08", desktop: 385, batch: 320 },
  { date: "2024-06-09", desktop: 438, batch: 480 },
  { date: "2024-06-10", desktop: 155, batch: 200 },
  { date: "2024-06-11", desktop: 92, batch: 150 },
  { date: "2024-06-12", desktop: 492, batch: 420 },
  { date: "2024-06-13", desktop: 81, batch: 130 },
  { date: "2024-06-14", desktop: 426, batch: 380 },
  { date: "2024-06-15", desktop: 307, batch: 350 },
  { date: "2024-06-16", desktop: 371, batch: 310 },
  { date: "2024-06-17", desktop: 475, batch: 520 },
  { date: "2024-06-18", desktop: 107, batch: 170 },
  { date: "2024-06-19", desktop: 341, batch: 290 },
  { date: "2024-06-20", desktop: 408, batch: 450 },
  { date: "2024-06-21", desktop: 169, batch: 210 },
  { date: "2024-06-22", desktop: 317, batch: 270 },
  { date: "2024-06-23", desktop: 480, batch: 530 },
  { date: "2024-06-24", desktop: 132, batch: 180 },
  { date: "2024-06-25", desktop: 141, batch: 190 },
  { date: "2024-06-26", desktop: 434, batch: 380 },
  { date: "2024-06-27", desktop: 448, batch: 490 },
  { date: "2024-06-28", desktop: 149, batch: 200 },
  { date: "2024-06-29", desktop: 103, batch: 160 },
  { date: "2024-06-30", desktop: 446, batch: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  batches,
}: {
  batches: BatchWithMediaAndCreatedBy[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Batches</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="batch"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
