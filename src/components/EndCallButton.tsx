import useStreamCall from "@/app/hooks/useStreamCall";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

export const EndCallButton = () => {
  const call = useStreamCall();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const participantIsChannelOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!participantIsChannelOwner) return null;

  return (
    <Button variant={"destructive"} onClick={call.endCall}>
      End call for everyone
    </Button>
  );
};

export default EndCallButton;
