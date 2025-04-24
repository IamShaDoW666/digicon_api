"use server";
import {
  userCreateSchema,
  UserFormData,
} from "@/app/admin/users/new-user-modal";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const deleteUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return {
    success: true,
    message: "User deleted successfully",
  };
};

export const updateUser = async (
  userId: string,
  name: string,
  email: string,
  phone: string,
  password: string
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name,
      email: email,
      // phone: phone,
      password: await bcrypt.hash(password, 10),
    },
  });

  return {
    success: true,
    message: "User updated successfully",
    data: updateUser,
  };
};

export const createUser = async (userData: UserFormData) => {
  // const validatedFields = userCreateSchema.safeParse(userData);
  // if (!validatedFields.success) {
  //   throw new Error("Invalid user data");
  // }
  try {
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        // phone: userData.phone,
        password: await bcrypt.hash(userData.password, 10),
      },
    });
    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Error creating user",
      error: e,
    };
  }
};
