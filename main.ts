// Entry for make.fun bounty "post-x-promote-make-your-own-bounty-01".
// Reads POST.json (the X post entered for this bounty) and prints the
// entry's post link and play code. No network, no randomness, no secrets:
// the grader runs this as `node /bot/main.ts` on a read-only filesystem.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BOUNTY_SLUG: string = "post-x-promote-make-your-own-bounty-01";
const BOUNTY_URL: string =
  "https://make.fun/bounty/post-x-promote-make-your-own-bounty-01";
const PLAY_CODE: string = "makefun-cello-magnet-tapestry";
const HANDLE: string = "AnnoBuilds";

type PostLink = {
  url: string;
};

function loadPostLink(): PostLink {
  const here: string = dirname(fileURLToPath(import.meta.url));
  const raw: string = readFileSync(join(here, "POST.json"), "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null || !("url" in parsed)) {
    throw new Error("POST.json must be an object with a url field");
  }
  const url: unknown = (parsed as PostLink).url;
  if (typeof url !== "string" || url.length === 0) {
    throw new Error("POST.json url must be a non-empty string");
  }
  return { url };
}

function main(): void {
  const post: PostLink = loadPostLink();
  const match: RegExpMatchArray | null = post.url.match(
    /^https:\/\/(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)$/,
  );
  if (match === null) {
    throw new Error(`Unexpected post URL in POST.json: ${post.url}`);
  }
  const handle: string = match[1];
  const statusId: string = match[2];
  if (handle !== HANDLE) {
    throw new Error(`Expected handle @${HANDLE}, got @${handle}`);
  }
  console.log(`Bounty: ${BOUNTY_SLUG}`);
  console.log(`Bounty page: ${BOUNTY_URL}`);
  console.log(`Post: ${post.url}`);
  console.log(`Handle: @${handle}`);
  console.log(`Status id: ${statusId}`);
  console.log(`Play code: ${PLAY_CODE}`);
}

main();
