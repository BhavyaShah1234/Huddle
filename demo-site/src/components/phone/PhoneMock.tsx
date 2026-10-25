"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/story/playback";
import type { ThreadId } from "@/story/scenario";

export type Contact = { name: string; ini: string; color: string };

function StatusBar({ time = "9:41" }: { time?: string }) {
  return (
    <div className="relative flex h-[44px] shrink-0 items-center justify-between px-6 pt-1 text-[13px] font-semibold text-black">
      <span>{time}</span>
      <div className="absolute left-1/2 top-[9px] h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1" aria-hidden="true">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="7" width="3" height="3" rx="0.6" />
          <rect x="4.3" y="5" width="3" height="5" rx="0.6" />
          <rect x="8.6" y="2.6" width="3" height="7.4" rx="0.6" />
          <rect x="12.9" y="0" width="3" height="10" rx="0.6" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
          <path d="M7 2.2c2 0 3.8.8 5.1 2l1-1A8.6 8.6 0 0 0 7 .8 8.6 8.6 0 0 0 .9 3.2l1 1A7.2 7.2 0 0 1 7 2.2Zm0 2.8c1.2 0 2.3.5 3.1 1.2l1-1A5.8 5.8 0 0 0 7 3.6c-1.6 0-3 .6-4.1 1.6l1 1C4.7 5.5 5.8 5 7 5Zm0 2.8c.5 0 .9.2 1.2.5L7 9.5 5.8 8.3c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <span className="relative ml-0.5 inline-block h-[11px] w-[22px] rounded-[3px] border border-black/40 p-[1px]">
          <span className="block h-full w-[78%] rounded-[1.5px] bg-black" />
        </span>
      </span>
    </div>
  );
}

function Avatar({ c, size = 28 }: { c: Contact; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(180deg, color-mix(in srgb, ${c.color} 75%, white), ${c.color})`,
      }}
    >
      {c.ini}
    </span>
  );
}

function ThreadHeader({ c, back }: { c: Contact; back?: number }) {
  return (
    <div className="relative flex h-[62px] shrink-0 flex-col items-center justify-center border-b border-black/10 bg-[#f6f6f6]/95">
      <span className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 text-[15px] text-[#0A84FF]">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 1.5 1.5 8.5l7 7" />
        </svg>
        {back ? (
          <span className="ml-1 rounded-full bg-[#0A84FF] px-1.5 text-[11px] font-semibold leading-[17px] text-white">
            {back}
          </span>
        ) : null}
      </span>
      <Avatar c={c} size={30} />
      <span className="mt-0.5 flex items-center gap-0.5 text-[10.5px] text-black">
        {c.name}
        <svg width="5" height="8" viewBox="0 0 5 8" fill="none" stroke="#8e8e93" strokeWidth="1.3">
          <path d="m1 1 3 3-3 3" />
        </svg>
      </span>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="imsg-row them">
      <div className="imsg-bubble them tail typing" aria-label="typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function Conversation({
  messages,
  typing,
  ownerLabel = "Delivered",
}: {
  messages: Message[];
  typing: boolean;
  ownerLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastOutgoing = messages.findLastIndex((m) => m.from === "me");

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  return (
    <div ref={ref} className="imsg-scroll flex-1 overflow-y-auto px-3 pb-2 pt-1" data-lenis-prevent>
      {messages.map((m, i) => {
        const next = messages[i + 1];
        const tail = !next || next.from !== m.from || !!next.stamp;
        const prev = messages[i - 1];
        const newRun = !prev || prev.from !== m.from || !!m.stamp;
        return (
          <div key={m.key}>
            {m.stamp && (
              <p className="pb-1 pt-3 text-center text-[10.5px] text-[#8e8e93]">
                <b className="font-semibold">{m.stamp.split(" ")[0]}</b>{" "}
                {m.stamp.split(" ").slice(1).join(" ")}
              </p>
            )}
            <div className={`imsg-row ${m.from} ${newRun ? "mt-2" : "mt-[2px]"}`}>
              <div className={`imsg-bubble imsg-in ${m.from} ${tail ? "tail" : ""}`}>
                {m.text}
                {m.share && <span className="imsg-share">{m.share}</span>}
              </div>
            </div>
            {i === lastOutgoing && (
              <p className="mt-0.5 pr-1 text-right text-[10px] text-[#8e8e93]">
                {i === messages.length - 1 ? ownerLabel : "Read"}
              </p>
            )}
          </div>
        );
      })}
      {typing && (
        <div className="mt-2">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}

function InputBar({ draft }: { draft: string }) {
  return (
    <div className="flex shrink-0 items-end gap-2 px-2.5 pb-5 pt-1.5">
      <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#e9e9eb] text-[18px] leading-none text-[#8e8e93]">
        +
      </span>
      <div className="flex min-h-[30px] flex-1 items-center justify-between gap-1 rounded-[16px] border border-black/15 py-1 pl-3 pr-1 text-[13px]">
        {draft ? (
          <span className="line-clamp-3 text-black">
            {draft}
            <span className="imsg-caret" />
          </span>
        ) : (
          <span className="text-[#c4c4c6]">iMessage</span>
        )}
        {draft ? (
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center self-end rounded-full bg-[#0A84FF]">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 11V1.5M1 5.2 5 1.2l4 4" />
            </svg>
          </span>
        ) : (
          <svg className="mr-1" width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#8e8e93" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3.5" y="1" width="5" height="9" rx="2.5" />
            <path d="M1 7.5a5 5 0 0 0 10 0M6 12.5V15" />
          </svg>
        )}
      </div>
    </div>
  );
}

function ThreadList({
  threads,
  contacts,
  messages,
}: {
  threads: ThreadId[];
  contacts: Record<string, Contact>;
  messages: Message[];
}) {
  // Most recent conversation first.
  const ordered = [...threads].sort(
    (a, b) =>
      messages.findLastIndex((m) => m.thread === b) -
      messages.findLastIndex((m) => m.thread === a),
  );
  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-1 text-[14px] text-[#0A84FF]">
        <span>Edit</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M8 2.5H4A1.5 1.5 0 0 0 2.5 4v10A1.5 1.5 0 0 0 4 15.5h10a1.5 1.5 0 0 0 1.5-1.5v-4M7 11l1-3.2 6.5-6.5a1.5 1.5 0 0 1 2.1 2.1L10.2 10 7 11Z" />
        </svg>
      </div>
      <h3 className="px-4 pb-2 pt-1 text-[26px] font-bold tracking-tight text-black">Messages</h3>
      <div className="mx-4 mb-2 flex h-[28px] items-center gap-1.5 rounded-[9px] bg-[#e9e9eb] px-2 text-[13px] text-[#8e8e93]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="5" cy="5" r="3.8" />
          <path d="m8 8 3 3" strokeLinecap="round" />
        </svg>
        Search
      </div>
      {ordered.map((t) => {
        const last = messages.findLast((m) => m.thread === t);
        const unread = last?.from === "them" && t === "mei";
        return (
          <div key={t} className="imsg-in-soft flex items-center gap-2.5 py-2 pl-1.5 pr-4">
            <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${unread ? "bg-[#0A84FF]" : ""}`} />
            <Avatar c={contacts[t]} size={40} />
            <div className="min-w-0 flex-1 border-b border-black/10 pb-2">
              <div className="flex items-baseline justify-between gap-2">
                <b className="truncate text-[14px] font-semibold text-black">{contacts[t].name}</b>
                <span className="shrink-0 text-[11px] text-[#8e8e93]">{last?.time?.split(" ").slice(1).join(" ") || "now"}</span>
              </div>
              <p className="line-clamp-2 text-[12.5px] leading-snug text-[#8e8e93]">{last?.text ?? ""}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PhoneMock({
  messages,
  view,
  threads,
  contacts,
  typing,
  draft,
  className = "",
  style,
}: {
  messages: Message[];
  view: "list" | ThreadId;
  threads: ThreadId[];
  contacts: Record<string, Contact>;
  typing: ThreadId | null;
  draft: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const inThread = view !== "list";
  const visible = inThread ? messages.filter((m) => m.thread === view) : [];
  const unreadElsewhere = inThread
    ? threads.filter((t) => t !== view && messages.findLast((m) => m.thread === t)?.from === "them" && t === "mei").length
    : 0;

  return (
    <div className={`phone ${className}`} style={style}>
      <div className="phone-screen">
        <StatusBar />
        {inThread ? (
          <div key={view} className="imsg-view flex min-h-0 flex-1 flex-col">
            <ThreadHeader c={contacts[view]} back={unreadElsewhere || undefined} />
            <Conversation messages={visible} typing={typing === view} />
            <InputBar draft={draft} />
          </div>
        ) : (
          <div key="list" className="imsg-view flex min-h-0 flex-1 flex-col">
            <ThreadList threads={threads} contacts={contacts} messages={messages} />
          </div>
        )}
        <div className="absolute bottom-[6px] left-1/2 h-[4px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
