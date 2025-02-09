import {
  HashtagIcon,
  TicketIcon,
  UsersIcon,
  ChatIcon,
} from "@heroicons/react/solid";
import { RiDiscordFill } from "react-icons/ri";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-10 mx-auto w-full border border-gray-800 bg-black bg-opacity-60 bg-clip-padding py-1 shadow-xl backdrop-blur-xl backdrop-filter firefox:bg-opacity-90">
      <div className=" mx-auto max-w-7xl px-4 sm:px-6  lg:px-8 ">
        <div className="flex h-16 items-center justify-between">
          <div className="flex">
            <Link legacyBehavior href="/">
              <div className="flex flex-shrink-0 cursor-pointer items-center text-white">
                <h2>Roka.</h2>
              </div>
            </Link>
          </div>

          <div className="hidden md:-my-px md:ml-6 md:flex md:space-x-8">
            <Link legacyBehavior href="/#title-management">
              <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:text-green-300">
                <TicketIcon className="mr-2 h-5 w-5" /> Title management
              </a>
            </Link>

            <Link legacyBehavior href="/#kvk-management">
              <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:text-green-300">
                <UsersIcon className="mr-2 h-5 w-5" /> KvK management
              </a>
            </Link>
            <Link legacyBehavior href="/#community">
              <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:text-green-300">
                <HashtagIcon className="mr-2 h-5 w-5" /> Community
              </a>
            </Link>
            <Link legacyBehavior href="/commands">
              <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:text-green-300">
                <ChatIcon className="mr-2 h-5 w-5" /> Commands
              </a>
            </Link>
          </div>

          <div className="-my-px ml-6 flex space-x-8 md:hidden">
            <Link legacyBehavior href="/commands">
              <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-white hover:text-green-300">
                <ChatIcon className="mr-2 h-5 w-5" /> Commands
              </a>
            </Link>
          </div>

          <div className="flex md:-my-px md:ml-6 md:space-x-8">
            <Link legacyBehavior href="https://discord.gg/dAa4axurq7">
              <a className="group relative  inline-flex">
                <div className="transitiona-all animate-tilt absolute -inset-px rounded-full bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] opacity-50 blur-lg duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"></div>

                <div className="text-md font-pj relative inline-flex items-center justify-center rounded-full bg-white px-4 py-2 font-bold text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                  <RiDiscordFill className="mr-1 h-4 w-4" />
                  Free trial
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
