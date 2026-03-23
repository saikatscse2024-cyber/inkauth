"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { tursoClient } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export async function loginAdmin(_prevState: any, formData: FormData) {
  const adminId = process.env.ADMIN_ID;
  const adminSecret = process.env.ADMIN_SECRET;

  const id = formData.get("id");
  const secret = formData.get("secret");

  if (!adminId || !adminSecret) {
    return { error: "Admin credentials not configured in .env.local" };
  }

  if (id === adminId && secret === adminSecret) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    // Redirect directly
  } else {
    return { error: "Invalid credentials. Check your .env setup." };
  }

  // Next.js redirect must be called outside the try/catch or if block 
  // safely so it can throw its internal RedirectError.
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function saveBookDetails(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cover_page = formData.get("cover_page") as string;
  const author_name = formData.get("author_name") as string;
  const detailed_description = formData.get("detailed_description") as string;
  const publication_date = formData.get("publication_date") as string;

  const client = tursoClient();
  if (!client) throw new Error("DB Error");

  try {
    const isNew = formData.get("isNew") === "true";
    if (isNew) {
      await client.batch([
        { sql: "INSERT INTO books (id, title, description, cover_page) VALUES (?, ?, ?, ?)", args: [id, title, description, cover_page] },
        { sql: "INSERT INTO book_details (book_id, author_name, detailed_description, publication_date) VALUES (?, ?, ?, ?)", args: [id, author_name, detailed_description, publication_date] }
      ], "write");
    } else {
      await client.batch([
        { sql: "UPDATE books SET title=?, description=?, cover_page=? WHERE id=?", args: [title, description, cover_page, id] },
        { sql: "INSERT INTO book_details (book_id, author_name, detailed_description, publication_date) VALUES (?, ?, ?, ?) ON CONFLICT(book_id) DO UPDATE SET author_name=?, detailed_description=?, publication_date=?", 
          args: [id, author_name, detailed_description, publication_date, author_name, detailed_description, publication_date] }
      ], "write");
    }
  } catch (e: any) {
    throw new Error(e.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/book/${id}`);
  
  redirect(`/admin/book/${id}`);
}

export async function deleteBook(formData: FormData) {
  const id = formData.get("id") as string;
  const client = tursoClient();
  if (client) {
     await client.execute({ sql: "DELETE FROM books WHERE id = ?", args: [id] });
  }
  revalidatePath("/");
  redirect("/admin");
}

export async function saveChapter(formData: FormData) {
  const chapter_id = formData.get("chapter_id") as string;
  const book_id = formData.get("book_id") as string;
  const chapter_number = parseInt(formData.get("chapter_number") as string);
  const chapter_title = formData.get("chapter_title") as string;
  const content = formData.get("content") as string;

  const client = tursoClient();
  if (!client) throw new Error("DB Error");

  const isNew = formData.get("isNew") === "true";
  try {
    if (isNew) {
      await client.execute({ sql: "INSERT INTO book_chapters (id, book_id, chapter_number, chapter_title, content) VALUES (?, ?, ?, ?, ?)", args: [chapter_id, book_id, chapter_number, chapter_title, content] });
    } else {
      await client.execute({ sql: "UPDATE book_chapters SET chapter_number=?, chapter_title=?, content=? WHERE id=?", args: [chapter_number, chapter_title, content, chapter_id] });
    }
  } catch(e:any) {
    throw new Error(e.message);
  }

  revalidatePath(`/admin/book/${book_id}`);
  revalidatePath(`/book/${book_id}`);
}

export async function deleteChapter(formData: FormData) {
  const id = formData.get("id") as string;
  const book_id = formData.get("book_id") as string;
  const client = tursoClient();
  if (client) {
     await client.execute({ sql: "DELETE FROM book_chapters WHERE id = ?", args: [id] });
  }
  revalidatePath(`/admin/book/${book_id}`);
  revalidatePath(`/book/${book_id}`);
}
