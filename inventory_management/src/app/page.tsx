import Image from "next/image";
import Link from "next/link";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]">
      <section className="container w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Typography variant="h1">Pantrify</Typography>
                <Typography variant="h2">
                  Streamline Your Inventory Management
                </Typography>
                <Typography variant="body1">
                  Our intuitive platform helps you track, organize, and optimize
                  your inventory with ease.
                </Typography>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/inventory"
                  className="px-6 py-6 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  prefetch={false}
                >
                  Use Inventory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
