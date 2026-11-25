import type { Metadata } from "next";
import MyList from "./MyList";

export const metadata: Metadata = { title: "My List" };

export default function Page() {
  return <MyList />;
}
