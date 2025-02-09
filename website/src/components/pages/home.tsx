import Layout from "@/components/layout/Layout";
import { ArrowRightIcon } from "@heroicons/react/solid";

import Link from "next/link";
import { RiDiscordFill } from "react-icons/ri";
import { TitleRequest } from "../title-request";
import {
  DiscordAttachment,
  DiscordAttachments,
  DiscordCommand,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordMessage,
  DiscordMessages,
} from "@skyra/discord-components-react";

const communities = [
  {
    name: "Discord",
    link: "https://discord.gg/dAa4axurq7",
    description: "Join us on Discord.",
    icon: RiDiscordFill,
  },
];

const metrics = [
  {
    id: 1,
    stat: "Pay once",
    rest: "You only pay for Roka. once, there is no subscription.",
  },
  {
    id: 2,
    stat: "Support",
    emphasis: "Lifetime",
    rest: "support is included.",
  },
  {
    id: 3,
    stat: "Customisation",
    emphasis: "Customise",
    rest: "your Discord bot to your liking. Change the name, picture etc...",
  },
  {
    id: 4,
    stat: "Feature requests",
    emphasis: "Request",
    rest: "new features and your wish may come true.",
  },
];

export default function Home() {
  return (
    <Layout>
      <main>
        <div className="absolute z-0">
          <div
            className="media-gradient z-10"
            style={{
              position: "absolute",
              height: 300,
              width: 400,
              top: 150,
              left: -100,
              opacity: 0.3,
              background: "#32e875",
            }}
          ></div>
          <div
            className="media-gradient z-0 hidden lg:block"
            style={{
              position: "absolute",
              height: 300,
              width: 400,
              bottom: -600,
              left: 1000,
              opacity: 0.8,
              background: "#32e875",
            }}
          ></div>
        </div>
        <div>
          <section className="relative py-12 sm:py-16 lg:pb-40">
            <div className="absolute bottom-0 right-0 overflow-hidden">
              <img
                className="h-auto w-full origin-bottom-right scale-150 transform lg:mx-auto lg:w-auto lg:scale-100 lg:object-cover"
                src="images/grid.png"
                alt=""
              />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:items-center xl:grid-cols-2">
                <div className="text-center md:px-16 lg:px-0 lg:text-left xl:col-span-1 xl:pr-20">
                  <h2 className="text-base font-semibold uppercase tracking-wide text-green-300">
                    Try Roka.
                  </h2>
                  <h1 className="font-pj bg-gradient-to-br from-green-100 to-green-400 bg-clip-text text-5xl font-extrabold  text-transparent sm:text-5xl lg:text-7xl">
                    Enhance your{" "}
                    <span className="font-pj text-stroke-white text-stroke-white text-stroke-10 bg-gradient-to-br from-yellow-100 to-yellow-400 bg-clip-text">
                      Rise of Kingdoms
                    </span>{" "}
                    experience
                  </h1>
                  <p className="font-inter mt-2 text-xl text-white sm:mt-6">
                    Roka. Allows you to manage Rise of Kingdoms KvK statistics
                    and kingdom titles through a Discord bot.
                  </p>

                  <div className="mx-auto mb-6 mt-6">
                    <Link legacyBehavior href="https://discord.gg/dAa4axurq7">
                      <a className="group relative inline-flex">
                        <div className="transitiona-all animate-tilt absolute -inset-px rounded-full bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] opacity-50 blur-lg duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"></div>

                        <div className="font-pj relative inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-lg font-bold text-black transition-all duration-200">
                          <RiDiscordFill className="mr-1 h-6 w-6" />
                          Join us on Discord
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="xl:col-span-1">
                  <TitleRequest />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="lg:py-xl bg-green px-5 py-6 sm:py-12 lg:rounded-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between md:space-x-16">
              <div className="max-w-lg xl:max-w-2xl">
                <h2 className="font-pj text-4xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">
                  Customisable {"&"} simple
                </h2>
              </div>

              <div className="mt-12 flex flex-grow items-center space-x-4 sm:space-x-8 md:mt-0 lg:space-x-16">
                <div>
                  <svg
                    className="h-auto w-4 text-green-900"
                    viewBox="0 0 16 81"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 56)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 21)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 49)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 14)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 42)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 7)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 70)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 35)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 0)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 63)"
                    />
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(0.83205 0.5547 0.5547 -0.83205 1 28)"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-pj text-4xl font-bold text-gray-900 xl:text-6xl">
                    Pay once!
                  </p>
                  <p className="font-pj mt-2 text-base font-normal text-gray-800 lg:text-xl">
                    + Get lifetime support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12" id="title-management">
          <div className="absolute z-0">
            <div
              className="media-gradient z-10"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                top: 900,
                left: -200,
                opacity: 0.3,
                background: "#5438dc",
              }}
            ></div>
            <div
              className="media-gradient z-0 hidden lg:block"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                bottom: -300,
                left: 400,
                opacity: 0.4,
                background: "#5438dc",
              }}
            ></div>
          </div>

          {/* Header */}
          <div className="relative">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              <div className="mx-auto text-center">
                <h2 className="text-base font-semibold uppercase tracking-wide text-blue-300">
                  Kingdom title management
                </h2>
                <h2 className="font-pj mx-auto  max-w-xl bg-gradient-to-br from-blue-100 to-blue-400 bg-clip-text text-4xl font-extrabold  text-transparent sm:text-5xl  lg:text-6xl">
                  Featuring a queue system
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-xl text-white">
                  With Roka., managing titles is fast and easy. No more fighting
                  about titles with a fair queue system!
                </p>
              </div>
            </div>
          </div>

          <section>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-2xl bg-gray-900 lg:grid lg:grid-cols-2">
                <div className="justify-center p-8 sm:py-12 xl:p-16">
                  <h2 className="text-base font-semibold uppercase tracking-wider text-green-300">
                    Titles
                  </h2>
                  <h2 className="font-pj max-w-xl bg-gradient-to-br from-green-400 to-green-700 bg-clip-text text-4xl font-extrabold  text-transparent sm:text-5xl  lg:text-6xl">
                    Request
                    <br /> with ease
                  </h2>

                  <div className="mt-8 flex lg:mt-16">
                    <div className="w-full">
                      <ul className="mt-8 space-y-12 lg:mt-16">
                        <li className="flex items-start">
                          <div className="font-pj inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green text-base font-bold text-gray-900">
                            1
                          </div>
                          <div className="ml-6">
                            <p className="font-pj text-lg font-bold text-green">
                              Request
                            </p>
                            <p className="font-pj mt-4 text-base font-normal text-gray-50">
                              Start by using the /title command.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="font-pj inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green text-base font-bold text-gray-900">
                            2
                          </div>
                          <div className="ml-6">
                            <p className="font-pj text-lg font-bold text-green">
                              Wait
                            </p>
                            <p className="font-pj mt-4 text-base font-normal text-gray-50">
                              Wait for the bot to hand out the requested title.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="font-pj inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green text-base font-bold text-gray-900">
                            3
                          </div>
                          <div className="ml-6">
                            <p className="font-pj text-lg font-bold text-green">
                              Enjoy
                            </p>
                            <p className="font-pj mt-4 text-base font-normal text-gray-50">
                              You now have the requested title in game. If
                              someone else requests the same one, you can press
                              &quot;Done&quot; to allow the next person to get
                              the title or wait 180 seconds.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="self-center sm:py-12 lg:p-8 xl:p-16">
                  <TitleRequest />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="relative  pt-16 lg:pb-32">
          <div className="absolute z-0">
            <div
              className="media-gradient z-10"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                top: 500,
                left: 0,
                opacity: 0.85,
                background: "#26ae58",
              }}
            ></div>
            <div
              className="media-gradient hidden lg:block"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                bottom: -400,
                left: 1000,
                opacity: 0.7,
                background: "#26ae58",
              }}
            ></div>
          </div>

          <section>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-2xl bg-gray-900 lg:grid lg:grid-cols-2">
                <div className="p-8 sm:py-12 xl:p-16">
                  <h2 className="text-base font-semibold uppercase tracking-wider text-green-300">
                    Queue
                  </h2>
                  <h2 className="font-pj max-w-xl bg-gradient-to-br from-green-400 to-green-700 bg-clip-text text-4xl font-extrabold  text-transparent sm:text-5xl  lg:text-6xl">
                    Fair
                    <br /> & reliable
                  </h2>

                  <ul className="mt-8 space-y-12 lg:mt-16">
                    <li className="flex items-start">
                      <div className="font-pj inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green text-base font-bold text-gray-900">
                        1
                      </div>
                      <div className="ml-6">
                        <p className="font-pj text-lg font-bold text-green">
                          Queue
                        </p>
                        <p className="font-pj mt-4 text-base font-normal text-gray-50">
                          If a title is requested that is still in use by
                          another, the person will be added to a queue.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="font-pj inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green text-base font-bold text-gray-900">
                        2
                      </div>
                      <div className="ml-6">
                        <p className="font-pj text-lg font-bold text-green">
                          Configure titles
                        </p>
                        <p className="font-pj mt-4 text-base font-normal text-gray-50">
                          You can set the duration of a title and/or lock them.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="sm:py-12 lg:p-8 xl:p-16">
                  <TitleRequest queueCount={2} showRequestedTitleReply={false}>
                    <DiscordMessage profile="roka">
                      <DiscordCommand
                        slot="reply"
                        author="Zion"
                        command="/configure-title"
                      />
                      <DiscordEmbed
                        slot="embeds"
                        color="#fff"
                        embedTitle="Title configurations"
                      >
                        <DiscordEmbedFields slot="fields">
                          <DiscordEmbedField fieldTitle="Justice">
                            {" "}
                            Locked: no <br />
                            Duration: 60 seconds{" "}
                          </DiscordEmbedField>
                          <DiscordEmbedField fieldTitle="Duke">
                            {" "}
                            Locked: no <br />
                            Duration: 60 seconds{" "}
                          </DiscordEmbedField>
                          <DiscordEmbedField fieldTitle="Architect">
                            {" "}
                            Locked: no <br />
                            Duration: 60 seconds{" "}
                          </DiscordEmbedField>
                          <DiscordEmbedField fieldTitle="Scientist">
                            {" "}
                            Locked: yes <br />
                            Duration: 180 seconds{" "}
                          </DiscordEmbedField>
                        </DiscordEmbedFields>
                      </DiscordEmbed>
                    </DiscordMessage>
                    <DiscordMessage profile="roka">
                      <DiscordCommand
                        slot="reply"
                        profile="daniell"
                        command="/request-title"
                      />
                      The Scientist is currently locked.
                    </DiscordMessage>
                  </TitleRequest>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="relative py-24" id="kvk-management">
          <div className="absolute z-0">
            <div
              className="media-gradient z-10"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                top: 200,
                left: -200,
                opacity: 0.3,
                background: "#5438dc",
              }}
            ></div>
            <div
              className="media-gradient z-0 hidden lg:block"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                bottom: -400,
                left: 1000,
                opacity: 0.8,
                background: "#5438dc",
              }}
            ></div>
          </div>

          <div className="absolute bottom-0 h-20 w-full py-40 lg:pl-10 xl:inset-0 xl:h-full">
            <div className="h-full w-full xl:grid xl:grid-cols-2">
              <div className="h-full xl:relative xl:col-start-2">
                <DiscordMessages className="rounded-lg">
                  <DiscordMessage profile="roka">
                    <DiscordCommand
                      slot="reply"
                      profile="daniell"
                      command="/export-kvk"
                    />
                    kvk-export.xlxs
                    <DiscordAttachments>
                      <DiscordAttachment
                        url="/images/attachment.svg"
                        width={30}
                        height={40}
                      ></DiscordAttachment>
                    </DiscordAttachments>
                  </DiscordMessage>
                  <DiscordMessage profile="roka">
                    <DiscordCommand
                      slot="reply"
                      profile="daniell"
                      command="/kvk-stats"
                    />
                    <DiscordEmbed
                      slot="embeds"
                      color="#fff"
                      embedTitle="KvK stats for Daniell"
                    >
                      <DiscordEmbedFields slot="fields">
                        <DiscordEmbedField
                          fieldTitle="Governor ID"
                          inline
                          inlineIndex={1}
                        >
                          {" "}
                          1234567{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="Rank"
                          inline
                          inlineIndex={2}
                        >
                          {" "}
                          #1{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="Power"
                          inline
                          inlineIndex={3}
                        >
                          {" "}
                          123,000,000{" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField
                          fieldTitle="Power difference"
                          inline
                          inlineIndex={1}
                        >
                          {" "}
                          123{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="Tier 4 kp gained"
                          inline
                          inlineIndex={2}
                        >
                          {" "}
                          123{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="Tier 5 kp gained"
                          inline
                          inlineIndex={3}
                        >
                          {" "}
                          123{" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField
                          fieldTitle="Dead gained"
                          inline
                          inlineIndex={1}
                        >
                          {" "}
                          123{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="DKP"
                          inline
                          inlineIndex={2}
                        >
                          {" "}
                          123,000,000{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="DKP goal"
                          inline
                          inlineIndex={3}
                        >
                          {" "}
                          777.000{" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField
                          fieldTitle="Dead requirement"
                          inline
                          inlineIndex={1}
                        >
                          {" "}
                          1,000,000.00{" "}
                        </DiscordEmbedField>
                        <DiscordEmbedField
                          fieldTitle="Goal reached"
                          inline
                          inlineIndex={2}
                        >
                          {" "}
                          20%{" "}
                        </DiscordEmbedField>
                      </DiscordEmbedFields>
                    </DiscordEmbed>
                  </DiscordMessage>
                </DiscordMessages>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-flow-col-dense xl:grid-cols-2 xl:gap-x-8">
            <div className="relative pb-40 pt-12 sm:pt-24 lg:pb-64 xl:col-start-1 xl:pb-24">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
                KvK management
              </h3>
              <h2 className="font-pj bg-gradient-to-br  from-green-100 to-blue-400 bg-clip-text text-5xl font-extrabold  text-transparent sm:text-5xl  lg:text-6xl">
                Enhance your Kingdom with (KvK) stats
              </h2>
              <p className="mt-5 text-lg text-white">
                Roka. Allows you to manage and track KvK data.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
                {metrics.map((item) => (
                  <p key={item.id}>
                    <span className="block text-2xl font-bold text-white">
                      {item.stat}
                    </span>
                    <span className="mt-1 block text-base text-gray-50">
                      <span className="font-medium text-white">
                        {item.emphasis}
                      </span>{" "}
                      {item.rest}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-64 overflow-hidden py-24 lg:mt-0">
          <div className="absolute z-0 ">
            <div
              className="media-gradient z-10 hidden lg:block"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                top: 0,
                left: 0,
                opacity: 0.35,
                background: "#26ae58",
              }}
            ></div>
            <div
              className="media-gradient hidden lg:block"
              style={{
                position: "absolute",
                height: 300,
                width: 400,
                bottom: -200,
                left: 1000,
                opacity: 0.2,
                background: "#26ae58",
              }}
            ></div>
          </div>

          <div
            className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            id="community"
          >
            <svg
              className="sm:height-50 lg:bottom-null absolute left-full -translate-x-1/2 -translate-y-3/4 transform sm:bottom-2 lg:left-auto lg:right-full lg:top-0 lg:translate-x-2/3 lg:translate-y-1/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-green-300 opacity-10"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)"
              />
            </svg>

            <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
              <div className="lg:col-span-1">
                <h2 className="font-pj bg-gradient-to-br  from-green-100 to-green-400 bg-clip-text text-5xl font-extrabold  text-transparent sm:text-5xl  lg:text-6xl">
                  Join our growing community
                </h2>
              </div>
              <dl className="mt-10 space-y-10 sm:grid sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 sm:space-y-0 lg:col-span-2 lg:mt-0 lg:pl-6">
                {communities.map((feature, index) => (
                  <a href={feature.link} key={index}>
                    <div className="cursor-pointer">
                      <dt>
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-500 bg-gray-600 text-white shadow-lg">
                          <feature.icon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-5 flex items-center text-xl font-medium leading-6 text-white underline">
                          {feature.name}{" "}
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </p>
                      </dt>
                      <dd className="mt-2 text-base text-gray-50">
                        {feature.description}
                      </dd>
                    </div>
                  </a>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
