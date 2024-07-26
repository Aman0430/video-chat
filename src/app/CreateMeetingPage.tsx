"use client";

import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/nextjs";
import {
  Call,
  MemberRequest,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Copy, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { getUserIds } from "./action";
import Link from "next/link";
import { toast } from "sonner";

type Props = {};

const CreateMeetingPage = (props: Props) => {
  const client = useStreamVideoClient();
  const { user } = useUser();
  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");

  const [call, setCall] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) {
      return;
    }

    try {
      const id = crypto.randomUUID();

      const callType = participantsInput ? "private-meeting" : "default";

      const call = client.call(callType, id);

      const memberEmails = participantsInput
        .split(",")
        .map((email) => email.trim());
      const memberIds = await getUserIds(memberEmails);
      const members: MemberRequest[] = memberIds
        .map((id) => ({
          user_id: id,
          role: "call_member",
        }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i,
        );

      const starts_at = new Date(startTimeInput || Date.now()).toISOString();

      await call.getOrCreate({
        data: {
          starts_at,
          members,
          custom: { description: descriptionInput },
        },
      });

      setCall(call);
    } catch (error) {
      console.error(error);
      toast("Something went wrong", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-10">
      <h1 className="mb-3 text-center text-4xl font-bold text-gray-800 dark:text-white">
        Welcome {user.username}!👋
      </h1>

      <BackgroundGradient className="max-w-sm rounded-[22px] bg-white dark:bg-zinc-900">
        <Card className="w-80 rounded-[22px] border-none bg-gradient-to-r from-fuchsia-900 to-purple-900">
          <CardHeader className="text-center text-2xl font-bold text-gray-200">
            Create a new meeting
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-10 text-white">
              <DescriptionInput
                value={descriptionInput}
                onChange={setDescriptionInput}
              />
              <StartTimeInput
                value={startTimeInput}
                onChange={setStartTimeInput}
              />
              <ParticipantsInput
                value={participantsInput}
                onChange={setParticipantsInput}
              />
            </CardDescription>
            <Button
              variant={"secondary"}
              onClick={createMeeting}
              className="mt-4 w-full"
              onWaiting={() => <Loader2 className="animate-spin" />}
            >
              Create
            </Button>
            {call && <MeetingLink call={call} />}
          </CardContent>
        </Card>
      </BackgroundGradient>
    </div>
  );
};

export default CreateMeetingPage;

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-semibold">Metting info:</div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            onChange("");
          }}
        />
        Add Description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-blue-300 p-2 text-gray-800"
          />
        </label>
      )}
    </div>
  );
};

interface StartTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StartTimeInput = ({ value, onChange }: StartTimeInputProps) => {
  const [active, setActive] = useState(false);
  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting start:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeLocalNow);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Start time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeLocalNow}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-800"
          />
        </label>
      )}
    </div>
  );
};

interface ParticipantsInputProps {
  value: string;
  onChange: (value: string) => void;
}

function ParticipantsInput({ value, onChange }: ParticipantsInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Participants:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Everyone with link can join
      </label>
      <label className="flex items-center gap-1.5">
        <input type="radio" checked={active} onChange={() => setActive(true)} />
        Private meeting
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Participant emails</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter participant email addresses separated by commas"
            className="w-full rounded-md border border-blue-300 p-2 text-gray-800"
          />
        </label>
      )}
    </div>
  );
}

interface MeetingLinkProps {
  call: Call;
}

const MeetingLink = ({ call }: MeetingLinkProps) => {
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`;

  return (
    <div className="mt-2 flex flex-row items-center justify-between gap-3 text-center">
      <Button
        className="w-full gap-2"
        variant={"destructive"}
        onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast("Copied to clipboard", {
            description: "Meeting Link is copied successfully",
          });
        }}
      >
        Copy <Copy />
      </Button>
      <Button className="w-full gap-2" variant={"destructive"}>
        <Link
          href={getMailToLink(
            meetingLink,
            call.state.startsAt,
            call.state.custom.description,
          )}
          target="_blank"
        >
          Send
        </Link>
        <Send />
      </Button>
    </div>
  );
};

const getMailToLink = (
  meetingLink: string,
  startsAt?: Date,
  description?: string,
) => {
  const startDateFormatted = startsAt
    ? startsAt.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : undefined;

  const subject =
    "Join my meeting" + (startDateFormatted ? ` at ${startDateFormatted}` : "");

  const body =
    `Join my meeting at ${meetingLink}.` +
    (startDateFormatted
      ? `\n\nThe meeting starts at ${startDateFormatted}.`
      : "") +
    (description ? `\n\nDescription: ${description}` : "");

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
