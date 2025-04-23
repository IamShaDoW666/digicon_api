// components/BatchCard.tsx
"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema using zod
const batchSchema = z.object({
  reference: z.string().min(1, "Reference is required"),
});

type BatchFormValues = z.infer<typeof batchSchema>;

interface BatchCardProps {
  reference: string;
}

export function BatchCard({ reference }: BatchCardProps) {
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: { reference },
  });

  const handleSubmit = (data: BatchFormValues) => {};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch reference" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="p-0">
              <Button type="submit">Update</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
