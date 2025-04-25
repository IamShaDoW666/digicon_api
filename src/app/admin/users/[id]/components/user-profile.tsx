/* eslint-disable */
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { updateUser, updateUserProfile } from "@/actions/user";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
});

type UserFormData = z.infer<typeof userSchema>;

const UserProfile = ({
  name,
  email,
  id,
  phone,
  profile,
  role,
}: {
  name: string;
  email: string;
  phone: string;
  id: string;
  profile?: string;
  role: "ADMIN" | "USER";
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: id,
      name: name ?? "",
      email: email,
      phone: phone,
      password: "",
      role: role,
    },
  });
  const [imageUrl, setImageUrl] = useState(
    profile ?? "https://avatar.iran.liara.run/public/26"
  );

  const [profileFile, setProfileFile] = useState<File>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file) {
      setProfileFile(file);
      const uploadedImageUrl = URL.createObjectURL(file); // Replace with your upload logic
      setImageUrl(uploadedImageUrl);
    }
  };
  const onSubmit = async (data: UserFormData) => {
    try {
      const res = await updateUser(
        data.id,
        data.name ?? "",
        data.email,
        data.phone ?? "",
        imageUrl,
        data.role,
        data.password!
      );
      let result = {
        success: true,
      };
      if (profileFile) {
        result = await updateUserProfile(data.id, profileFile!);
      }

      if (res.success && result.success) {
        toast("User updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="">
      <Toaster />
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="sm:text-3xl">User Details</CardTitle>
            <CardDescription>View and edit user details</CardDescription>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="w-32 h-32 rounded-xl">
              <img
                src={imageUrl}
                width={600}
                height={600}
                alt={name ?? email}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <Label htmlFor="profile-image">Upload New Profile Image</Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
