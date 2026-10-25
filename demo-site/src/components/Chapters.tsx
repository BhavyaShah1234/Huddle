"use client";

import { CHAPTERS, THREADS, type ChapterId } from "@/story/scenario";
import { phoneState } from "@/story/playback";
import { POD, SWIMMING, INTEREST_COUNT } from "@/story/huddle";
import Chapter from "./Chapter";
import PhoneMock from "./phone/PhoneMock";
import ProfileCard from "./cards/ProfileCard";
import DiscoveryGrid from "./cards/DiscoveryGrid";
import RankingTable from "./cards/RankingTable";
import NegotiationTranscript from "./cards/NegotiationTranscript";
import EscalationPhone from "./cards/EscalationPhone";
import HandshakeCard from "./cards/HandshakeCard";
import {
  FreeTimesCard,
  GroupBox,
  InterestSummary,
  Poster,
  PrivacyCard,
  Stats,
} from "./cards/StudentCards";
import { Appear, Panel } from "./cards/ui";

const ONBOARD_TEXT = CHAPTERS[0].beats.find((b) => b.from === "me")!.text;

function Behind({ id, p }: { id: ChapterId; p: number }) {
  switch (id) {
    case "onboard":
      return (
        <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <ProfileCard progress={p} input={ONBOARD_TEXT} />
          <div className="flex flex-col gap-3">
            <Appear on={p >= 0.46}>
              <FreeTimesCard highlight={["Mon-Morning", "Tue-Morning", "Wed-Morning", "Thu-Morning", "Fri-Morning"]} />
            </Appear>
            <Appear on={p >= 0.68}>
              <PrivacyCard />
            </Appear>
          </div>
        </div>
      );
    case "discover":
      return (
        <div className="flex flex-col gap-3">
          <Appear on={p >= 0.04}>
            <Panel label={<>Interest card · what the agent knows</>} meta="anonymous counts">
              <InterestSummary it={SWIMMING} />
            </Panel>
          </Appear>
          <DiscoveryGrid progress={p} />
        </div>
      );
    case "rank":
      return <RankingTable progress={p} />;
    case "negotiate":
      return <NegotiationTranscript progress={p} />;
    case "confirm":
      return <EscalationPhone progress={p} />;
    case "connect":
      return (
        <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <HandshakeCard progress={p} />
          <Appear on={p >= 0.3}>
            <GroupBox
              title="Swim partners"
              kind="Pair · alternating who leads"
              when="Wed 8:00am + Sat 9:00am · SDFC pool"
              people={["Mei"]}
              channel="Open Mei's thread in iMessage"
            />
          </Appear>
        </div>
      );
    case "updates":
      return (
        <div className="flex flex-col gap-3">
          <Appear on={p >= 0.3}>
            <Stats
              items={[
                { v: INTEREST_COUNT, s: "your interests" },
                { v: 3, s: "groups you're in", lead: true },
                { v: 0, s: "invites waiting for you" },
              ]}
            />
          </Appear>
          <Appear on={p >= 0.45} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <GroupBox
              title="New match: Swim partners"
              kind="Swimming · intermediate"
              when="Wed 8am + Sat 9am · SDFC"
              people={["Mei"]}
              channel="Open Mei's thread"
            />
            <GroupBox
              title={`Invite accepted: ${POD.title}`}
              kind={POD.kind}
              when={POD.when}
              people={POD.people}
              channel="Open pod chat"
            />
          </Appear>
          <Appear on={p >= 0.55}>
            <Poster />
          </Appear>
          <Appear on={p >= 0.7}>
            <PrivacyCard />
          </Appear>
        </div>
      );
  }
}

export default function Chapters() {
  return (
    <>
      {CHAPTERS.map((c, i) => (
        <Chapter
          key={c.id}
          chapter={c}
          index={i}
          renderPhone={(p) => {
            const s = phoneState(i, p);
            return (
              <>
                <PhoneMock
                  className="h-[min(600px,82vh)] lg:h-[min(620px,calc(100vh-var(--header-h)-11rem))]"
                  messages={s.messages}
                  view={s.view}
                  threads={s.threads}
                  contacts={THREADS}
                  typing={s.typing}
                  draft={s.draft}
                />
                {c.phoneNote && (
                  <p className="mt-3 flex items-center gap-2 font-sans text-xs text-ink-soft">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-clay" />
                    {c.phoneNote}
                  </p>
                )}
              </>
            );
          }}
          renderBehind={(p) => <Behind id={c.id} p={p} />}
        />
      ))}
    </>
  );
}
