export async function GET({ url }) {

  const imageUrl = url.searchParams.get("url");

  if (!imageUrl)
    return new Response("Missing url", { status: 400 });


  const res = await fetch(imageUrl);

  return new Response(await res.arrayBuffer(), {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public,max-age=31536000"
    }
  });

}
