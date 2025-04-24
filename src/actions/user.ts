"use server";
import { UserFormData } from "@/app/admin/users/new-user-modal";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import sharp from "sharp";
import fs from "fs";
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

export const updateUserProfile = async (id: string, profile: File) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const arrayBuffer = await profile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compress with Sharp: resize + JPEG quality
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 1024 }) // Resize to max width 1024px :contentReference[oaicite:6]{index=6}
    .jpeg({ quality: 70 }) // Compress JPEG to 80% quality :contentReference[oaicite:7]{index=7}
    .toBuffer(); // Get processed Buffer :contentReference[oaicite:8]{index=8}

  // Define output filename and path
  const fileName = `${Date.now()}-${profile.name}`.replace(/\s+/g, "");
  const filePath = path.join(uploadDir, fileName);
  // Write the compressed image to disk
  await fs.promises.writeFile(filePath, optimizedBuffer);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      profile: `/uploads/${fileName}`,
    },
  });
  return {
    success: true,
    message: "Profile updated",
  };
};

export const updateUser = async (
  userId: string,
  name: string,
  email: string,
  phone: string,
  password: string,
  role: "ADMIN" | "USER",
  profile: string
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
  if (profile)
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        email: email,
        phone: phone,
        role: role,
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
