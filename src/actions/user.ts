"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { userCreateSchema, UserFormData } from "@/schema/userSchema";
import { smtp } from "@/lib/smtp";
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
  profile: string,
  role: "ADMIN" | "USER",
  password?: string
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
        password: password?.length
          ? await bcrypt.hash(password!, 10)
          : user.password,
      },
    });

  return {
    success: true,
    message: "User updated successfully",
    data: updateUser,
  };
};

export const createUser = async (userData: UserFormData) => {
  const validatedFields = userCreateSchema.safeParse(userData);
  if (!validatedFields.success) {
    throw new Error("Invalid user data");
  }
  try {
    console.log(validatedFields.data);
    const newUser = await prisma.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        phone: validatedFields.data.phone,
        role: validatedFields.data.role,
        password: await bcrypt.hash(validatedFields.data.password, 10),
      },
    });

    // Send welcome email (optional)
    smtp.sendMail({
      from: process.env.SMTP_USER,
      to: validatedFields.data.email,
      subject: `Welcome ${validatedFields.data.name} to DigiCon!`,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to DigiCon</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
      }
      h2 {
        color: #2e6bff;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #2e6bff;
        color: #ffffff !important;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .credentials {
        background-color: #f1f1f1;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
        font-family: monospace;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #777777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Welcome to DigiCon, ${validatedFields.data.name}!</h2>
      <p>We’re excited to have you on board. Below are your login credentials to access your account:</p>

      <div class="credentials">
        <p><strong>Email:</strong> ${validatedFields.data.email}</p>
        <p><strong>Password:</strong> ${validatedFields.data.password}</p>
      </div>

      <p>You can log in using the link below:</p>
      <a href="${
        process.env.BASE_URL
      }/login" class="button">Log In to DigiCon</a>

      <p>If you have any questions or need help, just reply to this email—we’re here to help!</p>

      <div class="footer">
        &copy; ${new Date().getFullYear()} DigiCon. All rights reserved.
      </div>
    </div>
  </body>
</html>
`,
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
