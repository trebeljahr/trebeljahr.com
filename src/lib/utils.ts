import { activateEmailListMember } from "./mailgun";
import crypto from "crypto";
import { promisify } from "util";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { Note } from "@contentlayer/generated";
import { byDates } from "./dateUtils";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const scrypt = promisify(crypto.scrypt);

export async function getHash(str: string): Promise<string> {
  if (!process.env.SALT) throw Error("Please provide SALT in the .env file!");

  const hash: any = await scrypt(str, process.env.SALT, 32);
  return hash.toString("hex");
}

export async function checkHash(str: string, hashFromUrl: string) {
  if (!process.env.SALT) throw Error("Please provide SALT in the .env file!");

  const inputHash: any = await scrypt(str, process.env.SALT || "", 64);
  return inputHash.toString("hex") === hashFromUrl;
}

export async function confirmEmail(req: NextApiRequest, res: NextApiResponse) {
  if (!checkHash(req.query.email as string, req.query.hash as string)) {
    return res.status(400).json({
      error: "An error occured...",
      errorMessage:
        "Hash provided with query doesn't match hash from email! Did you click the correct link?",
    });
  }

  await activateEmailListMember(req.query.email as string);
}
export function replaceUndefinedWithNull(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = replaceUndefinedWithNull(obj[key]);
    }
  }

  return obj;
}
export function sortAndFilterNotes(stories: Note[], tripName?: string) {
  return stories
    .filter(({ published }) => published)
    .filter(({ parentFolder }) => !tripName || parentFolder === tripName)
    .sort(byDates);
}
