// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  name: string;
};

const access_token =
  "PHiKcDv6RuQIyqWBpiOe82nHLBYGJCgtGxP7lA9eRerbYXiKCxxRtDFvnqvuOoXB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { path, samples } = req.query;
  const { data } = await axios.get(
    `https://api.jawg.io/elevations?path=${encodeURIComponent(
      path as string
    )}&samples=${samples}&access-token=${access_token}`
  );
  res.status(200).json(data);
}
